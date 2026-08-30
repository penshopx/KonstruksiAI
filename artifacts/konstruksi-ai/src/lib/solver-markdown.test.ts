import assert from "node:assert/strict";
import test from "node:test";
import { renderSolverMarkdown } from "./solver-markdown.js";

test("renders supported Solver markdown formatting", () => {
  const rendered = renderSolverMarkdown("## Analisis\n**Tegas** dan `kode`");
  assert.match(rendered, /<h2[^>]*>Analisis<\/h2>/);
  assert.match(rendered, /<strong>Tegas<\/strong>/);
  assert.match(rendered, /<code[^>]*>kode<\/code>/);
});

test("escapes raw HTML before adding trusted formatter markup", () => {
  const rendered = renderSolverMarkdown(
    "<img src=x onerror=\"globalThis.pwned=true\"><script>globalThis.pwned=true</script>",
  );
  assert.doesNotMatch(rendered, /<img/i);
  assert.doesNotMatch(rendered, /<script/i);
  assert.doesNotMatch(rendered, /onerror="/i);
  assert.match(rendered, /&lt;img/);
  assert.match(rendered, /&lt;script&gt;/);
});