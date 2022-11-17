import React, { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor/MarkdownEditor';
import PdfExportView from './PdfExportView';
import FileStatus from './FileStatus';

export default function RootComponent() {
	const [code, setCode] = useState('');
	const [defaultView, setDefaultView] = useState(true);
	const [path, setPath] = useState('');
	const [codeFiles, setCodeFiles] = useState(
		new Map<string, [string, FileStatus]>()
	);

	const onCodeChange = React.useCallback((value: string) => {
		setCode(value);
	}, []);

	// create code files content
	// eslint-disable-next-line react-hooks/exhaustive-deps
	async function createCodeFilesContent(codeContent: string) {
		const regex = /!CodeFile\["(.*)"\]/g;
		let match: RegExpExecArray | null;
		// eslint-disable-next-line no-cond-assign
		while ((match = regex.exec(codeContent)) != null) {
			const codePath: string = match[1];
			// eslint-disable-next-line no-await-in-loop
			const file = await window.electronAPI.loadFile(codePath);
			if (file == null) {
				if (!codeFiles.has(codePath)) {
					setCodeFiles(
						(prev) =>
							new Map(
								prev.set(codePath, [
									'',
									FileStatus.PathNotFoundError,
								])
							)
					);
				}
			} else if (file[1] && !codeFiles.has(codePath)) {
				setCodeFiles(
					(prev) =>
						new Map(
							prev.set(codePath, ['', FileStatus.BinaryFileError])
						)
				);
			} else if (!codeFiles.has(codePath)) {
				setCodeFiles(
					(prev) =>
						new Map(
							prev.set(codePath, [file[0], FileStatus.Success])
						)
				);
			}
		}
	}

	useEffect(() => {
		window.electronAPI.onImportCodeFileFolder(async () => {
			const directory = await window.electronAPI.openFolder();
			if (directory != null) {
				let codeToAppend = '';
				const files = await window.electronAPI.readFilePaths(directory);
				files.forEach((folderPath, index) => {
					if (index === 0 && code.length !== 0) {
						codeToAppend += '\n';
					}
					codeToAppend += `!CodeFile["${folderPath}"]\n`;
				});
				createCodeFilesContent(code + codeToAppend);
				setCode((prev) => prev + codeToAppend);
			}
		});
		return () => {
			window.electronAPI.removeAllImportCodeFileFolderListeners();
		};
	}, [code, createCodeFilesContent]);

	useEffect(() => {
		window.electronAPI.onImportCodeFile(async () => {
			const file = await window.electronAPI.openFile();
			let codeToAppend = '';
			if (file != null) {
				if (code.length !== 0) {
					codeToAppend += '\n';
				}
				codeToAppend = `!CodeFile["${file}"]\n`;
				createCodeFilesContent(code + codeToAppend);
				setCode((prev) => prev + codeToAppend);
			}
		});
		return () => {
			window.electronAPI.removeAllImportCodeFileListeners();
		};
	}, [code, createCodeFilesContent]);

	// refresh code files
	useEffect(() => {
		window.electronAPI.onRefreshCodeFiles(() => {
			createCodeFilesContent(code);
		});
		return () => {
			window.electronAPI.removeAllRefreshCodeFilesListeners();
		};
	}, [code, createCodeFilesContent]);

	useEffect(() => {
		// pdf export with path started
		window.electronAPI.onExportPDFPathStarted(async () => {
			const filePath = await window.electronAPI.saveFile();
			setPath(filePath);
			setDefaultView(false);
		});
	}, []);

	useEffect(() => {
		// pdf export without path started
		window.electronAPI.onExportPDFStarted(() => {
			setPath('');
			setDefaultView(false);
		});
	}, []);

	useEffect(() => {
		// pdf export finished
		window.electronAPI.onExportPDFFinished(() => {
			setPath('');
			setDefaultView(true);
		});
	}, []);

	return (
		<>
			{defaultView && (
				<MarkdownEditor
					code={code}
					onCodeChange={onCodeChange}
					codeFiles={codeFiles}
				/>
			)}
			{!defaultView && (
				<PdfExportView code={code} path={path} codeFiles={codeFiles} />
			)}
		</>
	);
}
