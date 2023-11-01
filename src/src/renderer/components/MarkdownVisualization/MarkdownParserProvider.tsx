import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import parseMarkdown, { CodeType } from './CodeFileParser';
import FileStatus from '../FileStatus';
import { useSettings } from '../Settings/SettingsProvider';

const MarkdownParserContext = createContext<MarkdownParserProps | undefined>(
	undefined,
);

interface MarkdownParserProps {
	markdown: string;
	// list of portions of markdown that have been parsed
	markdownParsed: [CodeType, string][];
	setMarkdown: (value: string) => void;
}

export type Props = {
	children: ReactNode;
};

export default function MarkdownParserProvider(props: Props) {
	const [markdown, setMarkdown] = useState('');
	const [markdownParsed, setMarkdownParsed] = useState<[CodeType, string][]>(
		[],
	);
	const [codeFiles, setCodeFiles] = useState<
		Map<string, [string, FileStatus]>
	>(new Map());
	const { children } = props;
	const settings = useSettings();

	// extracts the paths from
	function extractPathsFromMarkdown(value: string) {
		const regex = /!CodeFile\["(.*)"\]/g;
		let match;
		const matches = [];
		// eslint-disable-next-line no-cond-assign
		while ((match = regex.exec(value)) != null) {
			matches.push(match[1]);
		}
		return matches;
	}

	// Creates code files content from markdown
	async function createCodeFilesContent(value: string) {
		const codePaths = extractPathsFromMarkdown(value);
		for (let i = 0; i < codePaths.length; i += 1) {
			const codePath = codePaths[i];
			if (!codeFiles.has(codePath)) {
				setCodeFiles(
					(prev) =>
						new Map(prev.set(codePath, ['', FileStatus.Loading])),
				);
			}
		}
		for (let i = 0; i < codePaths.length; i += 1) {
			const codePath = codePaths[i];

			// continue when code file already exists
			if (
				codeFiles.has(codePath) &&
				codeFiles.get(codePath)?.[1] !== FileStatus.Loading
			) {
				continue;
			}

			// eslint-disable-next-line no-await-in-loop
			const file = await window.electronAPI.loadFile(codePath);
			if (file == null) {
				setCodeFiles(
					(prev) =>
						new Map(
							prev.set(codePath, [
								'',
								FileStatus.PathNotFoundError,
							]),
						),
				);
			} else if (file[1]) {
				setCodeFiles(
					(prev) =>
						new Map(
							prev.set(codePath, [
								'',
								FileStatus.BinaryFileError,
							]),
						),
				);
			} else {
				setCodeFiles(
					(prev) =>
						new Map(
							prev.set(codePath, [file[0], FileStatus.Success]),
						),
				);
			}
		}
	}

	// Sets the markdown after code file folder was imported
	useEffect(() => {
		window.electronAPI.onImportCodeFileFolder(async () => {
			const directory = await window.electronAPI.openFolder();
			if (directory != null) {
				let codeToAppend = '';
				const files = await window.electronAPI.readFilePaths(directory);
				files.forEach((folderPath, index) => {
					if (index === 0 && markdown.length !== 0) {
						codeToAppend += '\n';
					}
					codeToAppend += `!CodeFile["${folderPath}"]\n`;
				});
				createCodeFilesContent(codeToAppend);
				setMarkdown((prev) => prev + codeToAppend);
			}
		});
		return () => {
			window.electronAPI.removeAllImportCodeFileFolderListeners();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [markdown]);

	// Sets the markdown after a single code file was imported
	useEffect(() => {
		window.electronAPI.onImportCodeFile(async () => {
			const file = await window.electronAPI.openFile();
			let codeToAppend = '';
			if (file != null) {
				if (markdown.length !== 0) {
					codeToAppend += '\n';
				}
				codeToAppend = `!CodeFile["${file}"]\n`;
				createCodeFilesContent(codeToAppend);
				setMarkdown((prev) => prev + codeToAppend);
			}
		});
		return () => {
			window.electronAPI.removeAllImportCodeFileListeners();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [markdown]);

	// Parses markdown
	useEffect(() => {
		const getData = setTimeout(async () => {
			const parsedValue = await parseMarkdown(markdown, codeFiles);
			setMarkdownParsed(parsedValue);
		}, 50);
		return () => clearTimeout(getData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [markdown, codeFiles]);

	// Sets new markdown settings
	useEffect(() => {
		const getData = setTimeout(async () => {
			settings?.setSettingsProperty('markdown', markdown);
		}, 1000);
		return () => clearTimeout(getData);
	}, [markdown, settings]);

	// Load markdown settings
	useEffect(() => {
		const value = settings?.getSettingsProperty('markdown');
		if (value !== undefined) setMarkdown(value);
	}, [settings]);

	useEffect(() => {
		window.electronAPI.onRefreshCodeFiles(() => {
			createCodeFilesContent(markdown);
		});
		return () => {
			window.electronAPI.removeAllRefreshCodeFilesListeners();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [markdown]);

	const value = useMemo(
		() => ({ markdown, markdownParsed, setMarkdown }),
		[markdown, markdownParsed],
	);

	return (
		<MarkdownParserContext.Provider value={value}>
			{children}
		</MarkdownParserContext.Provider>
	);
}

export const useMarkdownParser = () => useContext(MarkdownParserContext);
