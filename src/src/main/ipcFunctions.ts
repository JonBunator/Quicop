import { BrowserWindow, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { isText, isBinary } from 'istextorbinary';
import Store from 'electron-store';

export default class IpcFunctions {
	mainWindow: BrowserWindow;

	settingsStore: Store;

	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;
		this.settingsStore = new Store();
	}

	startExportPDF() {
		this.mainWindow.webContents.send('exportPDFStarted');
	}

	startExportPDFPath() {
		this.mainWindow.webContents.send('exportPDFPathStarted');
	}

	startImportCodeFileFolder() {
		this.mainWindow.webContents.send('onImportCodeFileFolder');
	}

	startImportCodeFile() {
		this.mainWindow.webContents.send('onImportCodeFile');
	}

	refreshCodeFiles() {
		this.mainWindow.webContents.send('onRefreshCodeFiles');
	}

	navigateToSettingsPage() {
		this.mainWindow.webContents.send('onNavigateToSettingsPage');
	}

	// export pdf
	exportPDF(pathToPdf: string) {
		// converts centimeters to inches
		function convertCMToInch(value: number) {
			return value * 0.393701;
		}
		let defaultFileName =
			this.getSettingsProperty('default-file-name') ?? 'code_files.pdf';
		if (!defaultFileName.endsWith('.pdf')) {
			defaultFileName += '.pdf';
		}
		const topMargin = Number(this.getSettingsProperty('top-margin') ?? 1.5);
		const bottomMargin = Number(
			this.getSettingsProperty('bottom-margin') ?? 2.5
		);
		const leftMargin = Number(this.getSettingsProperty('left-margin') ?? 2);
		const rightMargin = Number(
			this.getSettingsProperty('right-margin') ?? 2
		);

		let pdfPath = pathToPdf;
		if (pathToPdf === '')
			pdfPath = path.join(os.homedir(), 'Downloads', defaultFileName);
		this.mainWindow?.webContents
			.printToPDF({
				printBackground: true,
				pageSize: 'A4',
				footerTemplate:
					'<span style="font-size:10rem; margin-left:auto; margin-right:auto; margin-bottom:20px;" class="pageNumber"></span>',
				headerTemplate: ' ',
				displayHeaderFooter: true,
				preferCSSPageSize: true,
				margins: {
					top: convertCMToInch(topMargin),
					bottom: convertCMToInch(bottomMargin),
					left: convertCMToInch(leftMargin),
					right: convertCMToInch(rightMargin),
				},
			})
			.then((data) => {
				fs.writeFile(pdfPath, data, (error) => {
					if (error) throw error;
				});
				this.mainWindow.webContents.send('exportPDFFinished');
				return null;
			})
			.catch((error) => {
				console.log(`Failed to write PDF to ${pdfPath}: `, error);
			});
	}

	// save file
	async saveFile() {
		const dialogOptions = {
			filters: [{ name: 'PDF', extensions: ['pdf'] }],
		};
		const { canceled, filePath } = await dialog.showSaveDialog(
			this.mainWindow,
			dialogOptions
		);
		if (canceled) {
			return null;
		}
		return filePath;
	}

	// save file
	async openFolder() {
		const { canceled, filePaths } = await dialog.showOpenDialog(
			this.mainWindow,
			{
				properties: ['openDirectory'],
			}
		);
		if (canceled) {
			return null;
		}
		return filePaths[0];
	}

	// save file
	async openFile() {
		const { canceled, filePaths } = await dialog.showOpenDialog(
			this.mainWindow,
			{
				properties: ['openFile'],
			}
		);
		if (canceled) {
			return null;
		}
		return filePaths[0];
	}

	// load file, first return value is file content, second value specifies binary error
	loadFile = (filePath: string) => {
		let data;
		try {
			data = fs.readFileSync(filePath);
			// check if binary file
			if (isBinary(filePath, data)) {
				return ['', true];
			}
		} catch (err) {
			return null;
		}
		return [data.toString('utf8'), false];
	};

	private isUnixHiddenPath = (unixPath: string) => {
		// eslint-disable-next-line no-useless-escape
		return /(^|\/)\.[^\/\.]/g.test(unixPath);
	};

	// ignore files with certain file endings
	private ignoreFilesWithFileEndings = (filePath: string) => {
		const fileEndings = ['.ini'];
		for (let i = 0, len = fileEndings.length; i < len; i += 1) {
			if (filePath.endsWith(fileEndings[i])) {
				return true;
			}
		}
		return false;
	};

	// read file paths of specified directory
	getFilesOfDirectory = (dirPath: string): string[] => {
		const files = fs.readdirSync(dirPath);
		const codeFiles: string[] = [];
		files.forEach((file) => {
			const filePath = path.join(dirPath, file);
			if (fs.statSync(filePath).isDirectory()) {
				this.getFilesOfDirectory(filePath).forEach((currentPath) =>
					codeFiles.push(currentPath)
				);
			}
			// check if filename is text file and not a hidden file or ignored file
			else if (
				isText(filePath) &&
				!this.isUnixHiddenPath(filePath) &&
				!this.ignoreFilesWithFileEndings(filePath)
			) {
				codeFiles.push(filePath);
			}
		});
		return codeFiles;
	};

	// set settings
	setSettingsProperty(id: string, value: string) {
		this.settingsStore.set(id, value);
	}

	// get settings
	getSettingsProperty(id: string): string {
		return this.settingsStore.get(id) as string;
	}
}
