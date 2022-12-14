declare global {
	interface Window {
		electronAPI: {
			exportPDF(path: string): void;
			onExportPDFFinished(
				func: (...args: unknown[]) => void
			): (() => void) | undefined;
			onExportPDFStarted(
				func: (...args: unknown[]) => void
			): (() => void) | undefined;
			onExportPDFPathStarted(
				func: (...args: unknown[]) => void
			): (() => void) | undefined;
			onImportCodeFileFolder(
				func: (...args: unknown[]) => void
			): (() => void) | undefined;
			onRefreshCodeFiles(
				func: (...args: unknown[]) => void
			): (() => void) | undefined;
			onImportCodeFile(
				func: (...args: unknown[]) => void
			): (() => void) | undefined;
			onNavigateToSettingsPage(
				func: (...args: unknown[]) => void
			): (() => void) | undefined;
			removeAllImportCodeFileFolderListeners(): void;
			removeAllRefreshCodeFilesListeners(): void;
			removeAllImportCodeFileListeners(): void;
			removeAllNavigateToSettingsPageListeners(): void;
			removeAllSettingsPropertyChangedListeners(): void;
			exportPDFFinished(): void;
			saveFile(): Promise<string>;
			openFolder(): Promise<string>;
			openFile(): Promise<string>;
			readFilePaths(path: string): Promise<string[]>;
			loadFile(path: string): Promise<[string, boolean]>;
			setSettingsProperty(id: string, value: string): void;
			getSettingsProperty(id: string): Promise<string>;
		};
	}
}

export {};
