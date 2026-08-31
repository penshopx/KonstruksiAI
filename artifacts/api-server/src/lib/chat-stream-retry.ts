export interface ChatStreamChunk {
  choices?: Array<{
    delta?: {
      content?: unknown;
    };
  }>;
}

export interface ChatStreamRetryEvent {
  attempt: number;
  nextAttempt: number;
  maxAttempts: number;
  delayMs: number;
  partialLength: number;
}

export interface ChatStreamRetryFailure {
  error: unknown;
  attempt: number;
  partialResponse: string;
  partialLength: number;
}

export interface ChatStreamRetryOptions<TMessages> {
  initialMessages: TMessages;
  createStream: (
    messages: TMessages,
    attempt: number,
  ) => Promise<AsyncIterable<ChatStreamChunk>>;
  buildContinuationMessages: (
    initialMessages: TMessages,
    partialResponse: string,
  ) => TMessages;
  onContent: (content: string) => void;
  onRetry?: (event: ChatStreamRetryEvent) => void;
  onFailure?: (failure: ChatStreamRetryFailure) => void;
  maxAttempts?: number;
  baseDelayMs?: number;
  sleep?: (milliseconds: number) => Promise<void>;
  isCancelled?: () => boolean;
}

export type ChatStreamRetryResult =
  | { status: "completed"; response: string; attempts: number }
  | { status: "failed"; response: string; attempts: number; error: unknown }
  | { status: "cancelled"; response: string; attempts: number };

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_BASE_DELAY_MS = 500;
const RETRYABLE_OPENAI_STATUS_CODES = new Set([429, 500, 503]);

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("status" in error)) {
    return undefined;
  }

  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

export function isRetryableOpenAIError(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status !== undefined && RETRYABLE_OPENAI_STATUS_CODES.has(status);
}

function defaultSleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function runChatStreamWithRetry<TMessages>(
  options: ChatStreamRetryOptions<TMessages>,
): Promise<ChatStreamRetryResult> {
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  const sleep = options.sleep ?? defaultSleep;
  const isCancelled = options.isCancelled ?? (() => false);

  let response = "";
  let messages = options.initialMessages;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (isCancelled()) {
      return { status: "cancelled", response, attempts: attempt - 1 };
    }

    try {
      const stream = await options.createStream(messages, attempt);
      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (typeof content === "string" && content) {
          response += content;
          options.onContent(content);
        }
      }

      return { status: "completed", response, attempts: attempt };
    } catch (error) {
      if (isCancelled()) {
        return { status: "cancelled", response, attempts: attempt };
      }

      const canRetry =
        isRetryableOpenAIError(error) &&
        attempt < maxAttempts;

      if (!canRetry) {
        options.onFailure?.({
          error,
          attempt,
          partialResponse: response,
          partialLength: response.length,
        });
        return { status: "failed", response, attempts: attempt, error };
      }

      const delayMs = baseDelayMs * 2 ** (attempt - 1);
      options.onRetry?.({
        attempt,
        nextAttempt: attempt + 1,
        maxAttempts,
        delayMs,
        partialLength: response.length,
      });
      await sleep(delayMs);

      if (isCancelled()) {
        return { status: "cancelled", response, attempts: attempt };
      }

      try {
        messages = response
          ? options.buildContinuationMessages(options.initialMessages, response)
          : options.initialMessages;
      } catch (continuationError) {
        options.onFailure?.({
          error: continuationError,
          attempt,
          partialResponse: response,
          partialLength: response.length,
        });
        return {
          status: "failed",
          response,
          attempts: attempt,
          error: continuationError,
        };
      }
    }
  }

  // The loop always returns from a completion, cancellation, or failure path.
  // Keep a defensive result for callers if maxAttempts is ever configured to 0.
  return { status: "failed", response, attempts: 0, error: new Error("No stream attempts configured") };
}