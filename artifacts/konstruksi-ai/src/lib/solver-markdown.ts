function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderSolverMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto my-3 font-mono">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-700 px-1 rounded text-orange-300 text-xs">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, '<h3 class="text-white font-bold text-base mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-white font-bold text-lg mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-white font-bold text-xl mt-5 mb-3">$1</h1>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split("|").filter((cell) => cell.trim());
      return `<tr>${cells.map((cell) => `<td class="border border-slate-700 px-3 py-1.5 text-sm text-slate-300">${cell.trim()}</td>`).join("")}</tr>`;
    })
    .replace(/^- \[ \] (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300 text-sm"><span class="w-4 h-4 border border-slate-600 rounded mt-0.5 flex-shrink-0"></span><span>$1</span></li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="flex items-start gap-2 text-slate-300 text-sm"><span class="w-4 h-4 bg-green-500 rounded mt-0.5 flex-shrink-0 flex items-center justify-center text-white text-xs">✓</span><span>$1</span></li>')
    .replace(/^- (.+)$/gm, '<li class="text-slate-300 text-sm ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, "</p><p class='mb-3'>")
    .replace(/\n/g, "<br/>");
}