import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

export function CopyAnchor({ id, label }: { id: string; label: string }) {
  async function copy() {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(`Link to “${label}” copied`, { description: url });
    } catch {
      toast.error("Could not copy — select the address bar instead");
    }
    if (window.location.hash !== `#${id}`) window.history.replaceState(null, "", `#${id}`);
  }
  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy link to ${label}`}
      aria-label={`Copy link to ${label}`}
      className="rounded-md border border-emerald-500/20 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-slate-400 opacity-0 transition-all hover:border-emerald-500/60 hover:text-emerald-700 focus-visible:opacity-100 group-hover:opacity-100"
    >
      #
    </button>
  );
}

type Row = { key: string; cells: ReactNode[]; text: string[] };

export function DataTable({
  caption,
  columns,
  rows,
  filterLabel = "Filter rows",
  minWidth = 640,
}: {
  caption: string;
  columns: string[];
  rows: Row[];
  filterLabel?: string;
  minWidth?: number;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ col: number; dir: "asc" | "desc" } | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? rows.filter((r) => r.text.some((t) => t.toLowerCase().includes(q)))
      : rows.slice();
    if (sort) {
      filtered.sort((a, b) => {
        const cmp = (a.text[sort.col] ?? "").localeCompare(b.text[sort.col] ?? "");
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return filtered;
  }, [rows, query, sort]);

  function toggleSort(col: number) {
    setSort((prev) =>
      prev?.col === col
        ? prev.dir === "asc"
          ? { col, dir: "desc" }
          : null
        : { col, dir: "asc" },
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-emerald-500/20 bg-white px-3 py-2 focus-within:border-emerald-500/60 sm:max-w-xs">
          <span className="sr-only">{filterLabel}</span>
          <span aria-hidden="true" className="font-mono text-xs text-emerald-600">
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={filterLabel}
            className="w-full bg-transparent font-mono text-xs text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>
        <span className="font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
          {visible.length}/{rows.length} rows
        </span>
        {(query || sort) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSort(null);
            }}
            className="rounded-lg border border-emerald-500/20 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500 transition-all hover:border-emerald-500/60 hover:text-emerald-700"
          >
            Reset
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-left text-sm"
          style={{ minWidth: `${minWidth}px` }}
        >
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-emerald-500/20 font-mono text-[0.68rem] uppercase tracking-widest text-slate-500">
              {columns.map((c, i) => {
                const active = sort?.col === i;
                return (
                  <th key={c} scope="col" className="py-2 pr-4">
                    <button
                      type="button"
                      onClick={() => toggleSort(i)}
                      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                      className={`inline-flex items-center gap-1.5 uppercase tracking-widest transition-colors hover:text-emerald-700 ${
                        active ? "text-emerald-700" : ""
                      }`}
                    >
                      {c}
                      <span aria-hidden="true" className="text-[0.6rem]">
                        {active ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="text-slate-600">
            {visible.map((r) => (
              <tr key={r.key} className="border-b border-slate-100 last:border-0">
                {r.cells.map((cell, i) => (
                  <td key={i} className="py-3 pr-4 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center text-sm text-slate-400">
                  No rows match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
