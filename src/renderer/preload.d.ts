declare global {
  interface Window {
    electronAPI: {
      exportPDF(path: string): void;
      onExportPDFFinished(func: (...args: unknown[]) => void): (() => void) | undefined;
      onExportPDFStarted(func: (...args: unknown[]) => void): (() => void) | undefined;
      onExportPDFPathStarted(func: (...args: unknown[]) => void): (() => void) | undefined;
      exportPDFFinished(): void;
      saveFile(): Promise<string>;
    };
  }
}

export {};
