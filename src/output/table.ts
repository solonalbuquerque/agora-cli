export function renderTable(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "No results.";

  const headers = Object.keys(rows[0]);
  const widths = headers.map((header) => {
    const maxCell = Math.max(...rows.map((row) => String(row[header] ?? "").length));
    return Math.max(header.length, maxCell);
  });

  const renderRow = (row: Record<string, unknown>): string =>
    headers.map((h, i) => String(row[h] ?? "").padEnd(widths[i])).join("  ");

  const divider = widths.map((w) => "-".repeat(w)).join("  ");
  return [renderRow(Object.fromEntries(headers.map((h) => [h, h]))), divider, ...rows.map(renderRow)].join("\n");
}