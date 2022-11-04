declare global {
  interface Window {
    electronAPI: {
      exportPDF(): void;
      onExportPDFFinished(func: (...args: unknown[]) => void): (() => void) | undefined;
      onExportPDFStarted(func: (...args: unknown[]) => void): (() => void) | undefined;
      exportPDFFinished(): void;
      openFile(): string;
    };
  }
}

export {};
