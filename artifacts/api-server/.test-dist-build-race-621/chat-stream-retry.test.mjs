// src/lib/chat-stream-retry.test.ts
import assert from "node:assert/strict";
import test from "node:test";

// src/lib/chat-stream-retry.ts
var DEFAULT_MAX_ATTEMPTS = 3;
var DEFAULT_BASE_DELAY_MS = 500;
var RETRYABLE_OPENAI_STATUS_CODES = /* @__PURE__ */ new Set([429, 500, 503]);
function getErrorStatus(error) {
  if (typeof error !== "object" || error === null || !("status" in error)) {
    return void 0;
  }
  const status = error.status;
  return typeof status === "number" ? status : void 0;
}
function isRetryableOpenAIError(error) {
  const status = getErrorStatus(error);
  return status !== void 0 && RETRYABLE_OPENAI_STATUS_CODES.has(status);
}
function defaultSleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
async function runChatStreamWithRetry(options) {
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
      const canRetry = isRetryableOpenAIError(error) && attempt < maxAttempts;
      if (!canRetry) {
        options.onFailure?.({
          error,
          attempt,
          partialResponse: response,
          partialLength: response.length
        });
        return { status: "failed", response, attempts: attempt, error };
      }
      const delayMs = baseDelayMs * 2 ** (attempt - 1);
      options.onRetry?.({
        attempt,
        nextAttempt: attempt + 1,
        maxAttempts,
        delayMs,
        partialLength: response.length
      });
      await sleep(delayMs);
      if (isCancelled()) {
        return { status: "cancelled", response, attempts: attempt };
      }
      try {
        messages = response ? options.buildContinuationMessages(options.initialMessages, response) : options.initialMessages;
      } catch (continuationError) {
        options.onFailure?.({
          error: continuationError,
          attempt,
          partialResponse: response,
          partialLength: response.length
        });
        return {
          status: "failed",
          response,
          attempts: attempt,
          error: continuationError
        };
      }
    }
  }
  return { status: "failed", response, attempts: 0, error: new Error("No stream attempts configured") };
}

// src/lib/chat-stream-retry.test.ts
function streamFrom(chunks) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) yield chunk;
    }
  };
}
function streamError(status) {
  const error = new Error(`OpenAI ${status}`);
  error.status = status;
  return error;
}
test("retries a transient error before any content without adding continuation context", async () => {
  const attempts = [];
  const delays = [];
  const chunks = [];
  let callCount = 0;
  const result = await runChatStreamWithRetry({
    initialMessages: ["initial"],
    createStream: async (messages, attempt) => {
      attempts.push({ attempt, messages });
      callCount += 1;
      if (callCount === 1) throw streamError(429);
      return streamFrom([{ choices: [{ delta: { content: "jawaban" } }] }]);
    },
    buildContinuationMessages: (initialMessages, partialResponse) => [
      ...initialMessages,
      `assistant:${partialResponse}`,
      "user:Lanjutkan"
    ],
    onContent: (content) => chunks.push(content),
    onRetry: ({ delayMs }) => delays.push(delayMs),
    sleep: async (delayMs) => {
      delays.push(delayMs);
    }
  });
  assert.deepEqual(result, { status: "completed", response: "jawaban", attempts: 2 });
  assert.deepEqual(chunks, ["jawaban"]);
  assert.deepEqual(delays, [500, 500]);
  assert.deepEqual(attempts, [
    { attempt: 1, messages: ["initial"] },
    { attempt: 2, messages: ["initial"] }
  ]);
});
test("continues after a partial stream without duplicating the visible answer", async () => {
  const attempts = [];
  const retryEvents = [];
  let callCount = 0;
  const result = await runChatStreamWithRetry({
    initialMessages: ["user:Pertanyaan"],
    createStream: async (messages, attempt) => {
      attempts.push({ attempt, messages });
      callCount += 1;
      if (callCount === 1) {
        return {
          async *[Symbol.asyncIterator]() {
            yield { choices: [{ delta: { content: "Bagian awal. " } }] };
            throw streamError(503);
          }
        };
      }
      return streamFrom([{ choices: [{ delta: { content: "Bagian lanjutan." } }] }]);
    },
    buildContinuationMessages: (initialMessages, partialResponse) => [
      ...initialMessages,
      `assistant:${partialResponse}`,
      "user:Lanjutkan jawaban sebelumnya dari bagian terakhir tanpa mengulanginya."
    ],
    onContent: () => {
    },
    onRetry: (event) => retryEvents.push(event),
    sleep: async () => {
    }
  });
  assert.equal(result.status, "completed");
  assert.equal(result.response, "Bagian awal. Bagian lanjutan.");
  assert.deepEqual(retryEvents, [{
    attempt: 1,
    nextAttempt: 2,
    maxAttempts: 3,
    delayMs: 500,
    partialLength: "Bagian awal. ".length
  }]);
  assert.deepEqual(attempts, [
    { attempt: 1, messages: ["user:Pertanyaan"] },
    {
      attempt: 2,
      messages: [
        "user:Pertanyaan",
        "assistant:Bagian awal. ",
        "user:Lanjutkan jawaban sebelumnya dari bagian terakhir tanpa mengulanginya."
      ]
    }
  ]);
});
test("stops after three attempts with exponential backoff for transient failures", async () => {
  const delays = [];
  const failures = [];
  let callCount = 0;
  const result = await runChatStreamWithRetry({
    initialMessages: ["initial"],
    createStream: async () => {
      callCount += 1;
      throw streamError(callCount === 1 ? 500 : 503);
    },
    buildContinuationMessages: (initialMessages) => initialMessages,
    onContent: () => {
    },
    onRetry: ({ delayMs }) => delays.push(delayMs),
    onFailure: ({ attempt, partialResponse, partialLength }) => failures.push({ attempt, partialResponse, partialLength }),
    sleep: async () => {
    }
  });
  assert.equal(result.status, "failed");
  assert.equal(result.attempts, 3);
  assert.equal(callCount, 3);
  assert.deepEqual(delays, [500, 1e3]);
  assert.deepEqual(failures, [{ attempt: 3, partialResponse: "", partialLength: 0 }]);
});
test("does not retry non-transient errors", async () => {
  let callCount = 0;
  const failures = [];
  const result = await runChatStreamWithRetry({
    initialMessages: ["initial"],
    createStream: async () => {
      callCount += 1;
      throw streamError(400);
    },
    buildContinuationMessages: (initialMessages) => initialMessages,
    onContent: () => {
    },
    onFailure: ({ attempt }) => failures.push(attempt),
    sleep: async () => {
    }
  });
  assert.equal(result.status, "failed");
  assert.equal(result.attempts, 1);
  assert.equal(callCount, 1);
  assert.deepEqual(failures, [1]);
  assert.equal(isRetryableOpenAIError(streamError(429)), true);
  assert.equal(isRetryableOpenAIError(streamError(500)), true);
  assert.equal(isRetryableOpenAIError(streamError(503)), true);
  assert.equal(isRetryableOpenAIError(streamError(400)), false);
});
