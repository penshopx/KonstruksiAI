// src/lib/tender-analysis-errors.test.ts
import assert from "node:assert/strict";
import test from "node:test";

// src/lib/tender-analysis-errors.ts
var TenderAnalysisFailureError = class extends Error {
  constructor(failureCode) {
    super(failureCode);
    this.failureCode = failureCode;
    this.name = "TenderAnalysisFailureError";
  }
};
var FAILURE_MESSAGES = {
  AI_PROVIDER_NOT_CONFIGURED: {
    error: "Kredensial layanan AI belum tersedia.",
    action: "Minta administrator memeriksa konfigurasi layanan AI.",
    retryable: false,
    statusCode: 503
  },
  AI_PROVIDER_AUTHENTICATION_FAILED: {
    error: "Provider AI menolak autentikasi aplikasi.",
    action: "Minta administrator memeriksa kredensial dan akses provider AI; mencoba ulang saja tidak akan memperbaikinya.",
    retryable: false,
    statusCode: 502
  },
  AI_PROVIDER_CREDITS_EXHAUSTED: {
    error: "Kredit atau kuota provider AI tidak mencukupi.",
    action: "Minta administrator memeriksa saldo, billing, atau batas penggunaan provider AI.",
    retryable: false,
    statusCode: 402
  },
  AI_PROVIDER_RATE_LIMITED: {
    error: "Provider AI sedang membatasi jumlah permintaan.",
    action: "Tunggu beberapa saat, lalu coba jalankan analisis kembali.",
    retryable: true,
    statusCode: 429
  },
  AI_INVALID_MODEL_RESPONSE: {
    error: "Respons model AI kosong atau tidak sesuai format analisis yang dibutuhkan.",
    action: "Coba jalankan analisis kembali. Jika terus terjadi, informasikan tim teknis.",
    retryable: true,
    statusCode: 502
  },
  AI_PROVIDER_REQUEST_REJECTED: {
    error: "Provider AI menolak konfigurasi model atau permintaan analisis.",
    action: "Minta administrator memeriksa konfigurasi model dan provider AI.",
    retryable: false,
    statusCode: 502
  },
  AI_PROVIDER_UNAVAILABLE: {
    error: "Layanan provider AI sedang tidak tersedia atau koneksinya terputus.",
    action: "Tunggu beberapa saat, lalu coba kembali.",
    retryable: true,
    statusCode: 503
  },
  AI_INTERNAL_ERROR: {
    error: "Layanan internal gagal memproses atau menyimpan hasil analisis.",
    action: "Coba kembali nanti. Jika masalah berlanjut, hubungi tim teknis.",
    retryable: true,
    statusCode: 500
  }
};
function asRecord(value) {
  return typeof value === "object" && value !== null ? value : void 0;
}
function stringField(record, key) {
  const value = record?.[key];
  return typeof value === "string" ? value : void 0;
}
function numberField(record, key) {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function getErrorMetadata(error) {
  const record = asRecord(error);
  const response = asRecord(record?.response);
  const nested = asRecord(record?.error);
  const cause = asRecord(record?.cause);
  return {
    status: numberField(record, "status") ?? numberField(response, "status") ?? numberField(record, "statusCode"),
    code: stringField(record, "code") ?? stringField(nested, "code"),
    type: stringField(record, "type") ?? stringField(nested, "type"),
    message: error instanceof Error ? error.message : stringField(record, "message") ?? stringField(nested, "message") ?? "",
    networkCode: stringField(record, "code") ?? stringField(cause, "code"),
    name: error instanceof Error ? error.name : stringField(record, "name") ?? "UnknownError"
  };
}
function classifyTenderAnalysisError(error) {
  if (error instanceof TenderAnalysisFailureError) {
    return { code: error.failureCode, ...FAILURE_MESSAGES[error.failureCode] };
  }
  const metadata = getErrorMetadata(error);
  const code = `${metadata.code ?? ""} ${metadata.type ?? ""}`.toLowerCase();
  const message = metadata.message.toLowerCase();
  if (metadata.status === 402 || /insufficient[_ -]?(quota|credit)|out of credits|credit balance|billing account|add credits/.test(`${code} ${message}`)) {
    return { code: "AI_PROVIDER_CREDITS_EXHAUSTED", ...FAILURE_MESSAGES.AI_PROVIDER_CREDITS_EXHAUSTED };
  }
  if (metadata.status === 429 || /rate[_ -]?limit/.test(code)) {
    return { code: "AI_PROVIDER_RATE_LIMITED", ...FAILURE_MESSAGES.AI_PROVIDER_RATE_LIMITED };
  }
  if (/invalid[_ -]?response|model[_ -]?output/.test(code)) {
    return { code: "AI_INVALID_MODEL_RESPONSE", ...FAILURE_MESSAGES.AI_INVALID_MODEL_RESPONSE };
  }
  if (/invalid[_ -]?model|content[_ -]?filter/.test(code) || /invalid model|no endpoints found|content filter/.test(message)) {
    return { code: "AI_PROVIDER_REQUEST_REJECTED", ...FAILURE_MESSAGES.AI_PROVIDER_REQUEST_REJECTED };
  }
  if (metadata.status === 401 || metadata.status === 403 || /invalid[_ -]?api[_ -]?key|authentication[_ -]?error/.test(code)) {
    return { code: "AI_PROVIDER_AUTHENTICATION_FAILED", ...FAILURE_MESSAGES.AI_PROVIDER_AUTHENTICATION_FAILED };
  }
  if (metadata.status === 400 || /model.*not found|unsupported model|no endpoints found/.test(message)) {
    return { code: "AI_PROVIDER_REQUEST_REJECTED", ...FAILURE_MESSAGES.AI_PROVIDER_REQUEST_REJECTED };
  }
  if (metadata.status !== void 0 && [408, 425, 500, 502, 503, 504].includes(metadata.status) || ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED", "ENOTFOUND", "EAI_AGAIN"].includes(metadata.networkCode ?? "") || /network|timeout|timed out|connection reset/.test(message)) {
    return { code: "AI_PROVIDER_UNAVAILABLE", ...FAILURE_MESSAGES.AI_PROVIDER_UNAVAILABLE };
  }
  return { code: "AI_INTERNAL_ERROR", ...FAILURE_MESSAGES.AI_INTERNAL_ERROR };
}
function isRetryableTenderProviderError(error) {
  const failure = classifyTenderAnalysisError(error);
  return failure.code === "AI_PROVIDER_RATE_LIMITED" || failure.code === "AI_PROVIDER_UNAVAILABLE";
}
function getTenderProviderRequestId(source) {
  const record = asRecord(source);
  const headers = record?.headers ?? asRecord(record?.response)?.headers;
  const readHeader = (name) => {
    const values = asRecord(headers);
    if (typeof values?.get === "function") {
      try {
        const value = values.get.call(headers, name);
        return typeof value === "string" ? value : void 0;
      } catch {
        return void 0;
      }
    }
    const key = Object.keys(values ?? {}).find((key2) => key2.toLowerCase() === name);
    return key ? stringField(values, key) : void 0;
  };
  const candidates = [
    stringField(record, "request_id"),
    stringField(record, "_request_id"),
    readHeader("x-request-id"),
    readHeader("x-openrouter-request-id")
  ];
  return candidates.find((value) => value !== void 0 && /^[a-zA-Z0-9_.:-]{1,150}$/.test(value) && !/^sk-/i.test(value));
}
function getTenderAnalysisErrorDiagnostics(error) {
  const metadata = getErrorMetadata(error);
  const providerRequestId = getTenderProviderRequestId(error);
  const safeToken = (value) => value && /^[a-zA-Z0-9_.:-]{1,100}$/.test(value) ? value : void 0;
  return {
    errorName: safeToken(metadata.name) ?? "UnknownError",
    ...metadata.status !== void 0 ? { providerStatus: metadata.status } : {},
    ...safeToken(metadata.code) ? { providerCode: safeToken(metadata.code) } : {},
    ...safeToken(metadata.type) ? { providerType: safeToken(metadata.type) } : {},
    ...safeToken(metadata.networkCode) ? { networkCode: safeToken(metadata.networkCode) } : {},
    ...providerRequestId ? { providerRequestId } : {}
  };
}

// src/lib/tender-analysis-errors.test.ts
test("extracts vendor request IDs from SDK metadata and whitelisted headers only", () => {
  assert.equal(getTenderProviderRequestId({ request_id: "req_abc-123" }), "req_abc-123");
  assert.equal(getTenderProviderRequestId({ _request_id: "req_sdk" }), "req_sdk");
  assert.equal(getTenderProviderRequestId({ headers: { "X-Request-Id": "req_error" } }), "req_error");
  assert.equal(getTenderProviderRequestId({
    response: { headers: new Headers({ "x-openrouter-request-id": "or_request-1" }) }
  }), "or_request-1");
  assert.equal(getTenderProviderRequestId({
    response: { headers: { get: (name) => name === "x-openrouter-request-id" ? "or_sdk_headers" : null } }
  }), "or_sdk_headers");
  assert.equal(getTenderProviderRequestId({ headers: { authorization: "Bearer private" } }), void 0);
  assert.equal(getTenderProviderRequestId({ request_id: "sk-do-not-log", headers: { "x-request-id": "req_safe" } }), "req_safe");
  assert.equal(getTenderProviderRequestId({ request_id: "unsafe\nheader" }), void 0);
  assert.equal(getTenderProviderRequestId({ request_id: "x".repeat(151) }), void 0);
  const diagnostics = getTenderAnalysisErrorDiagnostics({
    request_id: "req_trace",
    status: 503,
    message: "private document content",
    headers: { authorization: "Bearer private" }
  });
  assert.equal(diagnostics.providerRequestId, "req_trace");
  assert.equal(JSON.stringify(diagnostics).includes("private"), false);
});
test("classifies missing provider configuration with an administrator action", () => {
  const failure = classifyTenderAnalysisError(
    new TenderAnalysisFailureError("AI_PROVIDER_NOT_CONFIGURED")
  );
  assert.equal(failure.code, "AI_PROVIDER_NOT_CONFIGURED");
  assert.equal(failure.retryable, false);
  assert.match(failure.error, /Kredensial layanan AI belum tersedia/);
  assert.match(failure.action, /administrator/);
});
test("classifies provider authentication errors without exposing provider text", () => {
  const failure = classifyTenderAnalysisError({
    status: 401,
    code: "invalid_api_key",
    message: "Invalid API key sk-do-not-expose-this"
  });
  assert.equal(failure.code, "AI_PROVIDER_AUTHENTICATION_FAILED");
  assert.equal(failure.retryable, false);
  assert.equal(failure.error.includes("sk-do-not-expose-this"), false);
  assert.equal(failure.action.includes("sk-do-not-expose-this"), false);
});
test("credits exhaustion takes precedence over a provider 429", () => {
  const failure = classifyTenderAnalysisError({
    status: 429,
    code: "insufficient_quota",
    message: "You have insufficient quota"
  });
  assert.equal(failure.code, "AI_PROVIDER_CREDITS_EXHAUSTED");
  assert.equal(failure.retryable, false);
  assert.equal(isRetryableTenderProviderError({ status: 429, code: "insufficient_quota" }), false);
});
test("classifies transient provider rate limits and outages as retryable", () => {
  assert.equal(
    classifyTenderAnalysisError({ status: 429, code: "rate_limit_exceeded" }).code,
    "AI_PROVIDER_RATE_LIMITED"
  );
  assert.equal(
    classifyTenderAnalysisError({ status: 503 }).code,
    "AI_PROVIDER_UNAVAILABLE"
  );
  assert.equal(
    classifyTenderAnalysisError({ cause: { code: "ETIMEDOUT" }, message: "request timed out" }).retryable,
    true
  );
  assert.equal(isRetryableTenderProviderError({ status: 503 }), true);
});
test("classifies invalid model responses and rejected model requests", () => {
  assert.equal(
    classifyTenderAnalysisError(new TenderAnalysisFailureError("AI_INVALID_MODEL_RESPONSE")).code,
    "AI_INVALID_MODEL_RESPONSE"
  );
  assert.equal(
    classifyTenderAnalysisError({ status: 400, message: "model not found" }).code,
    "AI_PROVIDER_REQUEST_REJECTED"
  );
  assert.equal(
    classifyTenderAnalysisError({ code: "invalid_response" }).code,
    "AI_INVALID_MODEL_RESPONSE"
  );
});
test("falls back to a safe internal error and records only bounded diagnostic metadata", () => {
  const error = Object.assign(new Error("sensitive provider response content"), {
    status: 500,
    code: "upstream_error"
  });
  const failure = classifyTenderAnalysisError(error);
  const diagnostics = getTenderAnalysisErrorDiagnostics(error);
  assert.equal(failure.code, "AI_PROVIDER_UNAVAILABLE");
  assert.equal(failure.error.includes("sensitive provider response content"), false);
  assert.equal("message" in diagnostics, false);
  assert.equal(diagnostics.providerCode, "upstream_error");
});
test("retries transient provider failures but not authentication or billing failures", () => {
  assert.equal(isRetryableTenderProviderError({ status: 503 }), true);
  assert.equal(isRetryableTenderProviderError({ code: "ETIMEDOUT" }), true);
  assert.equal(isRetryableTenderProviderError({ status: 401 }), false);
  assert.equal(isRetryableTenderProviderError({ status: 402 }), false);
  assert.equal(isRetryableTenderProviderError({ status: 429, code: "insufficient_quota" }), false);
  assert.equal(classifyTenderAnalysisError(new Error("Unexpected database failure")).code, "AI_INTERNAL_ERROR");
});
