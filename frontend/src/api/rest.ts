export async function fetchMarkdown() {
  const res = await fetch('/api/markdown');
  return res.text();
}
