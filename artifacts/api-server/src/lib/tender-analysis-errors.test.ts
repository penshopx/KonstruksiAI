import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyTenderAnalysisError,
  getTenderAnalysisErrorDiagnostics,
  getTenderProviderRequestId,
  isRetryableTenderProviderError,
  TenderAnalysisFailureError,
} from "./tender-analysis-errors.js";

test("extracts vendor request IDs from SDK metadata and whitelisted headers only", () => {
  assert.equal(getTenderProviderRequestId({ request_id: "req_abc-123" }), "req_abc-123");
  assert.equal(getTenderProviderRequestId({ _request_id: "req_sdk" }), "req_sdk");
  assert.equal(getTenderProviderRequestId({ headers: { "X-Request-Id": "req_error" } }), "req_error");
  assert.equal(getTenderProviderRequestId({
    response: { headers: new Headers({ "x-openrouter-request-id": "or_request-1" }) },
  }), "or_request-1");
  assert.equal(getTenderProviderRequestId({
    response: { headers: { get: (name: string) => name === "x-openrouter-request-id" ? "or_sdk_headers" : null } },
  }), "or_sdk_headers");
  assert.equal(getTenderProviderRequestId({ headers: { authorization: "Bearer private" } }), undefined);
  assert.equal(getTenderProviderRequestId({ request_id: "sk-do-not-log", headers: { "x-request-id": "req_safe" } }), "req_safe");
  assert.equal(getTenderProviderRequestId({ request_id: "unsafe\nheader" }), undefined);
  assert.equal(getTenderProviderRequestId({ request_id: "x".repeat(151) }), undefined);
  const diagnostics = getTenderAnalysisErrorDiagnostics({
    request_id: "req_trace",
    status: 503,
    message: "private document content",
    headers: { authorization: "Bearer private" },
  });
  assert.equal(diagnostics.providerRequestId, "req_trace");
  assert.equal(JSON.stringify(diagnostics).includes("private"), false);
});

test("classifies missing provider configuration with an administrator action", () => {
  const failure = classifyTenderAnalysisError(
    new TenderAnalysisFailureError("AI_PROVIDER_NOT_CONFIGURED"),
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
    message: "Invalid API key sk-do-not-expose-this",
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
    message: "You have insufficient quota",
  });

  assert.equal(failure.code, "AI_PROVIDER_CREDITS_EXHAUSTED");
  assert.equal(failure.retryable, false);
  assert.equal(isRetryableTenderProviderError({ status: 429, code: "insufficient_quota" }), false);
});

test("classifies transient provider rate limits and outages as retryable", () => {
  assert.equal(
    classifyTenderAnalysisError({ status: 429, code: "rate_limit_exceeded" }).code,
    "AI_PROVIDER_RATE_LIMITED",
  );
  assert.equal(
    classifyTenderAnalysisError({ status: 503 }).code,
    "AI_PROVIDER_UNAVAILABLE",
  );
  assert.equal(
    classifyTenderAnalysisError({ cause: { code: "ETIMEDOUT" }, message: "request timed out" }).retryable,
    true,
  );
  assert.equal(isRetryableTenderProviderError({ status: 503 }), true);
});

test("classifies invalid model responses and rejected model requests", () => {
  assert.equal(
    classifyTenderAnalysisError(new TenderAnalysisFailureError("AI_INVALID_MODEL_RESPONSE")).code,
    "AI_INVALID_MODEL_RESPONSE",
  );
  assert.equal(
    classifyTenderAnalysisError({ status: 400, message: "model not found" }).code,
    "AI_PROVIDER_REQUEST_REJECTED",
  );
  assert.equal(
    classifyTenderAnalysisError({ code: "invalid_response" }).code,
    "AI_INVALID_MODEL_RESPONSE",
  );
});

test("falls back to a safe internal error and records only bounded diagnostic metadata", () => {
  const error = Object.assign(new Error("sensitive provider response content"), {
    status: 500,
    code: "upstream_error",
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
