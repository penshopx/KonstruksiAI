export type TenderAnalysisErrorCode =
  | "AI_PROVIDER_NOT_CONFIGURED"
  | "AI_PROVIDER_AUTHENTICATION_FAILED"
  | "AI_PROVIDER_CREDITS_EXHAUSTED"
  | "AI_PROVIDER_RATE_LIMITED"
  | "AI_INVALID_MODEL_RESPONSE"
  | "AI_PROVIDER_REQUEST_REJECTED"
  | "AI_PROVIDER_UNAVAILABLE"
  | "AI_INTERNAL_ERROR";

export interface TenderAnalysisFailure {
  code: TenderAnalysisErrorCode;
  error: string;
  action: string;
  retryable: boolean;
  statusCode: number;
}

export class TenderAnalysisFailureError extends Error {
  constructor(readonly failureCode: TenderAnalysisErrorCode) {
    super(failureCode);
    this.name = "TenderAnalysisFailureError";
  }
}

const FAILURE_MESSAGES: Record<TenderAnalysisErrorCode, Omit<TenderAnalysisFailure, "code">> = {
  AI_PROVIDER_NOT_CONFIGURED: {
    error: "Kredensial layanan AI belum tersedia.",
    action: "Minta administrator memeriksa konfigurasi layanan AI.",
    retryable: false,
    statusCode: 503,
  },
  AI_PROVIDER_AUTHENTICATION_FAILED: {
    error: "Provider AI menolak autentikasi aplikasi.",
    action: "Minta administrator memeriksa kredensial dan akses provider AI; mencoba ulang saja tidak akan memperbaikinya.",
    retryable: false,
    statusCode: 502,
  },
  AI_PROVIDER_CREDITS_EXHAUSTED: {
    error: "Kredit atau kuota provider AI tidak mencukupi.",
    action: "Minta administrator memeriksa saldo, billing, atau batas penggunaan provider AI.",
    retryable: false,
    statusCode: 402,
  },
  AI_PROVIDER_RATE_LIMITED: {
    error: "Provider AI sedang membatasi jumlah permintaan.",
    action: "Tunggu beberapa saat, lalu coba jalankan analisis kembali.",
    retryable: true,
    statusCode: 429,
  },
  AI_INVALID_MODEL_RESPONSE: {
    error: "Respons model AI kosong atau tidak sesuai format analisis yang dibutuhkan.",
    action: "Coba jalankan analisis kembali. Jika terus terjadi, informasikan tim teknis.",
    retryable: true,
    statusCode: 502,
  },
  AI_PROVIDER_REQUEST_REJECTED: {
    error: "Provider AI menolak konfigurasi model atau permintaan analisis.",
    action: "Minta administrator memeriksa konfigurasi model dan provider AI.",
    retryable: false,
    statusCode: 502,
  },
  AI_PROVIDER_UNAVAILABLE: {
    error: "Layanan provider AI sedang tidak tersedia atau koneksinya terputus.",
    action: "Tunggu beberapa saat, lalu coba kembali.",
    retryable: true,
    statusCode: 503,
  },
  AI_INTERNAL_ERROR: {
    error: "Layanan internal gagal memproses atau menyimpan hasil analisis.",
    action: "Coba kembali nanti. Jika masalah berlanjut, hubungi tim teknis.",
    retryable: true,
    statusCode: 500,
  },
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : undefined;
}

function stringField(record: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = record?.[key];
  return typeof value === "string" ? value : undefined;
}

function numberField(record: Record<string, unknown> | undefined, key: string): number | undefined {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getErrorMetadata(error: unknown) {
  const record = asRecord(error);
  const response = asRecord(record?.response);
  const nested = asRecord(record?.error);
  const cause = asRecord(record?.cause);

  return {
    status: numberField(record, "status") ?? numberField(response, "status") ?? numberField(record, "statusCode"),
    code: stringField(record, "code") ?? stringField(nested, "code"),
    type: stringField(record, "type") ?? stringField(nested, "type"),
    message: error instanceof Error
      ? error.message
      : stringField(record, "message") ?? stringField(nested, "message") ?? "",
    networkCode: stringField(record, "code") ?? stringField(cause, "code"),
    name: error instanceof Error ? error.name : stringField(record, "name") ?? "UnknownError",
  };
}

export function classifyTenderAnalysisError(error: unknown): TenderAnalysisFailure {
  if (error instanceof TenderAnalysisFailureError) {
    return { code: error.failureCode, ...FAILURE_MESSAGES[error.failureCode] };
  }

  const metadata = getErrorMetadata(error);
  const code = `${metadata.code ?? ""} ${metadata.type ?? ""}`.toLowerCase();
  const message = metadata.message.toLowerCase();

  if (
    metadata.status === 402 ||
    /insufficient[_ -]?(quota|credit)|out of credits|credit balance|billing account|add credits/.test(`${code} ${message}`)
  ) {
    return { code: "AI_PROVIDER_CREDITS_EXHAUSTED", ...FAILURE_MESSAGES.AI_PROVIDER_CREDITS_EXHAUSTED };
  }

  if (metadata.status === 429 || /rate[_ -]?limit/.test(code)) {
    return { code: "AI_PROVIDER_RATE_LIMITED", ...FAILURE_MESSAGES.AI_PROVIDER_RATE_LIMITED };
  }

  if (/invalid[_ -]?response|model[_ -]?output/.test(code)) {
    return { code: "AI_INVALID_MODEL_RESPONSE", ...FAILURE_MESSAGES.AI_INVALID_MODEL_RESPONSE };
  }

  if (
    /invalid[_ -]?model|content[_ -]?filter/.test(code) ||
    /invalid model|no endpoints found|content filter/.test(message)
  ) {
    return { code: "AI_PROVIDER_REQUEST_REJECTED", ...FAILURE_MESSAGES.AI_PROVIDER_REQUEST_REJECTED };
  }

  if (
    metadata.status === 401 ||
    metadata.status === 403 ||
    /invalid[_ -]?api[_ -]?key|authentication[_ -]?error/.test(code)
  ) {
    return { code: "AI_PROVIDER_AUTHENTICATION_FAILED", ...FAILURE_MESSAGES.AI_PROVIDER_AUTHENTICATION_FAILED };
  }

  if (
    metadata.status === 400 ||
    /model.*not found|unsupported model|no endpoints found/.test(message)
  ) {
    return { code: "AI_PROVIDER_REQUEST_REJECTED", ...FAILURE_MESSAGES.AI_PROVIDER_REQUEST_REJECTED };
  }

  if (
    (metadata.status !== undefined && [408, 425, 500, 502, 503, 504].includes(metadata.status)) ||
    ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED", "ENOTFOUND", "EAI_AGAIN"].includes(metadata.networkCode ?? "") ||
    /network|timeout|timed out|connection reset/.test(message)
  ) {
    return { code: "AI_PROVIDER_UNAVAILABLE", ...FAILURE_MESSAGES.AI_PROVIDER_UNAVAILABLE };
  }

  return { code: "AI_INTERNAL_ERROR", ...FAILURE_MESSAGES.AI_INTERNAL_ERROR };
}

export function isRetryableTenderProviderError(error: unknown): boolean {
  const failure = classifyTenderAnalysisError(error);
  return failure.code === "AI_PROVIDER_RATE_LIMITED" || failure.code === "AI_PROVIDER_UNAVAILABLE";
}

export function getTenderAnalysisErrorDiagnostics(error: unknown): {
  errorName: string;
  providerStatus?: number;
  providerCode?: string;
  providerType?: string;
  networkCode?: string;
} {
  const metadata = getErrorMetadata(error);
  const safeToken = (value: string | undefined) =>
    value && /^[a-zA-Z0-9_.:-]{1,100}$/.test(value) ? value : undefined;
  return {
    errorName: safeToken(metadata.name) ?? "UnknownError",
    ...(metadata.status !== undefined ? { providerStatus: metadata.status } : {}),
    ...(safeToken(metadata.code) ? { providerCode: safeToken(metadata.code) } : {}),
    ...(safeToken(metadata.type) ? { providerType: safeToken(metadata.type) } : {}),
    ...(safeToken(metadata.networkCode) ? { networkCode: safeToken(metadata.networkCode) } : {}),
  };
}
