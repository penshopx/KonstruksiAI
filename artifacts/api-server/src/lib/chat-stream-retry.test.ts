import assert from "node:assert/strict";
import test from "node:test";
import {
  isRetryableOpenAIError,
  runChatStreamWithRetry,
  type ChatStreamChunk,
} from "./chat-stream-retry";

function streamFrom(chunks: ChatStreamChunk[]): AsyncIterable<ChatStreamChunk> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) yield chunk;
    },
  };
}

function streamError(status: number): Error & { status: number } {
  const error = new Error(`OpenAI ${status}`) as Error & { status: number };
  error.status = status;
  return error;
}

test("retries a transient error before any content without adding continuation context", async () => {
  const attempts: Array<{ attempt: number; messages: string[] }> = [];
  const delays: number[] = [];
  const chunks: string[] = [];
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
      "user:Lanjutkan",
    ],
    onContent: (content) => chunks.push(content),
    onRetry: ({ delayMs }) => delays.push(delayMs),
    sleep: async (delayMs) => { delays.push(delayMs); },
  });

  assert.deepEqual(result, { status: "completed", response: "jawaban", attempts: 2 });
  assert.deepEqual(chunks, ["jawaban"]);
  assert.deepEqual(delays, [500, 500]);
  assert.deepEqual(attempts, [
    { attempt: 1, messages: ["initial"] },
    { attempt: 2, messages: ["initial"] },
  ]);
});

test("continues after a partial stream without duplicating the visible answer", async () => {
  const attempts: Array<{ attempt: number; messages: string[] }> = [];
  const retryEvents: Array<{ attempt: number; nextAttempt: number; delayMs: number; partialLength: number }> = [];
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
          },
        };
      }
      return streamFrom([{ choices: [{ delta: { content: "Bagian lanjutan." } }] }]);
    },
    buildContinuationMessages: (initialMessages, partialResponse) => [
      ...initialMessages,
      `assistant:${partialResponse}`,
      "user:Lanjutkan jawaban sebelumnya dari bagian terakhir tanpa mengulanginya.",
    ],
    onContent: () => {},
    onRetry: (event) => retryEvents.push(event),
    sleep: async () => {},
  });

  assert.equal(result.status, "completed");
  assert.equal(result.response, "Bagian awal. Bagian lanjutan.");
  assert.deepEqual(retryEvents, [{
    attempt: 1,
    nextAttempt: 2,
    maxAttempts: 3,
    delayMs: 500,
    partialLength: "Bagian awal. ".length,
  }]);
  assert.deepEqual(attempts, [
    { attempt: 1, messages: ["user:Pertanyaan"] },
    {
      attempt: 2,
      messages: [
        "user:Pertanyaan",
        "assistant:Bagian awal. ",
        "user:Lanjutkan jawaban sebelumnya dari bagian terakhir tanpa mengulanginya.",
      ],
    },
  ]);
});

test("stops after three attempts with exponential backoff for transient failures", async () => {
  const delays: number[] = [];
  const failures: Array<{ attempt: number; partialResponse: string; partialLength: number }> = [];
  let callCount = 0;

  const result = await runChatStreamWithRetry({
    initialMessages: ["initial"],
    createStream: async () => {
      callCount += 1;
      throw streamError(callCount === 1 ? 500 : 503);
    },
    buildContinuationMessages: (initialMessages) => initialMessages,
    onContent: () => {},
    onRetry: ({ delayMs }) => delays.push(delayMs),
    onFailure: ({ attempt, partialResponse, partialLength }) => failures.push({ attempt, partialResponse, partialLength }),
    sleep: async () => {},
  });

  assert.equal(result.status, "failed");
  assert.equal(result.attempts, 3);
  assert.equal(callCount, 3);
  assert.deepEqual(delays, [500, 1000]);
  assert.deepEqual(failures, [{ attempt: 3, partialResponse: "", partialLength: 0 }]);
});

test("does not retry non-transient errors", async () => {
  let callCount = 0;
  const failures: number[] = [];

  const result = await runChatStreamWithRetry({
    initialMessages: ["initial"],
    createStream: async () => {
      callCount += 1;
      throw streamError(400);
    },
    buildContinuationMessages: (initialMessages) => initialMessages,
    onContent: () => {},
    onFailure: ({ attempt }) => failures.push(attempt),
    sleep: async () => {},
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