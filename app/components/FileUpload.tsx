import { ChangeEvent } from "react";

type FileUploadProps = {
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function FileUpload({ onFileUpload }: FileUploadProps) {
  return (
    <div className="bg-[var(--surface)] rounded-sm border border-[var(--border)] p-5">
      <h2 className="font-display text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] text-center mb-4">
        Import Registry
      </h2>
      <label className="upload-zone block rounded-sm p-5 cursor-pointer bg-[var(--background)]">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onFileUpload}
          className="hidden"
        />
        <div className="text-center">
          <svg
            className="w-6 h-6 mx-auto mb-2 text-[var(--gold)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <p className="text-sm text-[var(--foreground)]">Upload List</p>
          <p className="text-xs text-[var(--muted)] mt-1">CSV or Excel</p>
        </div>
      </label>
    </div>
  );
}
