import { marked } from 'marked';
import hljs from 'highlight.js';
import './MarkdownVisualization.scss';
import { useEffect, useState } from 'react';
import FileStatus from '../FileStatus';

export interface MarkdownVisualizationProps {
	code: string;
	codeFiles: Map<string, [string, FileStatus]>;
	dark: boolean;
}

export default function MarkdownVisualization(
	props: MarkdownVisualizationProps
) {
	const [markup, setMarkup] = useState({ __html: '' });
	const { code } = props;

	// eslint-disable-next-line @typescript-eslint/no-shadow
	function highlightCode(code: string, lang: string) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(code, { language: lang }).value;
			} catch (err) {
				/* empty */
			}
		}

		try {
			return hljs.highlightAuto(code).value;
		} catch (err) {
			/* empty */
		}
		return '';
	}

	marked.setOptions({
		langPrefix: 'hljs language-',
		highlight: highlightCode,
		breaks: true,
	});

	function getCode(key: string) {
		let error = `\`\`\`bash\nFile "${key}" is not cached. Press F5 to refresh!\n\`\`\``;
		const { codeFiles } = props;
		if (codeFiles.has(key)) {
			// get file extension
			const [codeContent, fileStatus]: [string, FileStatus] =
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				codeFiles.get(key)!;
			if (fileStatus === FileStatus.BinaryFileError) {
				error = `\`\`\`bash\nBinary file with path "${key}" is not displayable!\n\`\`\``;
			} else if (fileStatus === FileStatus.PathNotFoundError) {
				error = `\`\`\`bash\nFile with path "${key}" was not found!\n\`\`\``;
			} else if (fileStatus === FileStatus.Success) {
				const language = key.slice(
					// eslint-disable-next-line no-bitwise
					((key.lastIndexOf('.') - 1) >>> 0) + 2
				);
				const prefix = '<pre><code>';
				const suffix = '</code></pre>';
				return prefix + highlightCode(codeContent, language) + suffix;
			}
		}
		return marked.parse(error);
	}
	const delay = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	async function parseSpecialMarkdown() {
		const regex = /!CodeFile\["(.*)"\]/g;
		let compiledCode = '';
		let match;
		let start = 0;
		// eslint-disable-next-line no-cond-assign
		while ((match = regex.exec(code)) != null) {
			const path: string = match[1];
			compiledCode += marked.parse(code.substring(start, match.index));
			compiledCode += getCode(path);
			start = regex.lastIndex;
		}
		compiledCode += marked.parse(code.substring(start));
		return compiledCode;
	}

	useEffect(() => {
		const getData = setTimeout(async () => {
			const parsedValue = await parseSpecialMarkdown();
			setMarkup({ __html: parsedValue });
		}, 50);
		return () => clearTimeout(getData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [code]);

	function isDarkTheme() {
		const { dark } = props;
		return dark ? ' q-dark' : ' q-light';
	}

	return (
		<div
			className={`q-markdown-visualization${isDarkTheme()}`}
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={markup}
		/>
	);
}
