export type ExportFormat = 'csv' | 'json' | 'xlsx';

export type AOA = (string | number | boolean | null)[][];

export type ExportSource =
  | { data: AOA }
  | { getData: () => Promise<AOA> };

export type ExportOptions = {
  format: ExportFormat;
  filename?: string;
  sheetName?: string; // for xlsx
  includeColumnLabels?: boolean;
  includeRowLabels?: boolean;
  columnLabels?: string[];
  rowLabels?: string[];
  csvDelimiter?: string; // default ','
  csvBOM?: boolean; // default true
};

const pad = (n: number) => String(n).padStart(2, '0');
export function buildTimestampedFilename(ext: ExportFormat) {
  const d = new Date();
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return `export-${stamp}.${ext}`;
}

function withHeaders(data: AOA, opt: ExportOptions): AOA {
  let out = data;
  if (opt.includeRowLabels && opt.rowLabels) {
    out = out.map((row, i) => [opt.rowLabels![i] ?? '', ...row]);
  }
  if (opt.includeColumnLabels && opt.columnLabels) {
    out = [opt.columnLabels!, ...out];
  }
  return out;
}

function downloadBlob(filename: string, blob: Blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

function exportCSV(data: AOA, opt: ExportOptions) {
  const delimiter = opt.csvDelimiter ?? ',';
  const bom = opt.csvBOM ?? true;
  const text = data.map(r => r.map(v => v ?? '').join(delimiter)).join('\n');
  const payload = (bom ? '\ufeff' : '') + text;
  downloadBlob(opt.filename ?? buildTimestampedFilename('csv'),
    new Blob([payload], { type: 'text/csv;charset=utf-8;' }));
}

function exportJSON(data: AOA, opt: ExportOptions) {
  downloadBlob(opt.filename ?? buildTimestampedFilename('json'),
    new Blob([JSON.stringify(data)], { type: 'application/json' }));
}

async function exportXLSX(data: AOA, opt: ExportOptions) {
  const XLSX = await import('xlsx');
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, opt.sheetName ?? 'Sheet1');
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  downloadBlob(opt.filename ?? buildTimestampedFilename('xlsx'),
    new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
}

export async function exportData(
  source: ExportSource,
  options: ExportOptions
) {
  const opt: ExportOptions = {
    includeColumnLabels: true,
    includeRowLabels: false,
    csvDelimiter: ',',
    csvBOM: true,
    ...options,
  };

  const aoa = 'data' in source ? source.data : await source.getData();
  const finalData = withHeaders(aoa, opt);

  if (opt.format === 'csv') return exportCSV(finalData, opt);
  if (opt.format === 'json') return exportJSON(finalData, opt);
  return exportXLSX(finalData, opt);
}

export async function downloadFromResponse(res: Response, fallbackExt: ExportFormat) {
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const blob = await res.blob();
  const disp = res.headers.get('Content-Disposition') ?? '';
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)/i.exec(disp);
  const filename = match?.[1] || buildTimestampedFilename(fallbackExt);
  downloadBlob(filename, blob);
}


