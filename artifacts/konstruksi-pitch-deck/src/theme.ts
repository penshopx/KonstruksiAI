const params = new URLSearchParams(window.location.search);
const requestedTheme = params.get("theme");

function applyDeckTheme(theme: "screen" | "print") {
  document.documentElement.dataset.deckTheme = theme;
}

applyDeckTheme(requestedTheme === "print" ? "print" : "screen");

window.addEventListener("beforeprint", () => applyDeckTheme("print"));
window.addEventListener("afterprint", () =>
  applyDeckTheme(requestedTheme === "print" ? "print" : "screen"),
);