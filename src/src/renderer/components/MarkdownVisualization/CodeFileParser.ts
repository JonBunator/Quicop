/* eslint-disable no-await-in-loop */
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import './MarkdownVisualization.scss';
import * as DOMPurify from 'dompurify';
import FileStatus from '../FileStatus';

export enum CodeType {
	Markdown,
	MathJax,
	Code,
}

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

// marked highlighter options
const marked = new Marked(
	{
		async: true,
		breaks: true,
	},
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight: highlightCode,
	}),
);

async function parseSaveMarkdown(markdown: string): Promise<string> {
	return DOMPurify.sanitize(await marked.parse(markdown));
}

async function getCode(
	key: string,
	codeFiles: Map<string, [string, FileStatus]>,
): Promise<string> {
	let error = `\`\`\`bash\nFile "${key}" is not cached. Press F5 to refresh!\n\`\`\``;
	if (codeFiles.has(key)) {
		// get file extension
		const [codeContent, fileStatus]: [string, FileStatus] =
			codeFiles.get(key)!;
		if (fileStatus === FileStatus.BinaryFileError) {
			error = `\`\`\`bash\nBinary file with path "${key}" is not displayable!\n\`\`\``;
		} else if (fileStatus === FileStatus.PathNotFoundError) {
			error = `\`\`\`bash\nFile with path "${key}" was not found!\n\`\`\``;
		} else if (fileStatus === FileStatus.Loading) {
			error = `\`\`\`bash\nFile with path "${key}" is currently loading...\n\`\`\``;
		} else if (fileStatus === FileStatus.Success) {
			const language = key.slice(
				// eslint-disable-next-line no-bitwise
				((key.lastIndexOf('.') - 1) >>> 0) + 2,
			);
			const prefix = '<pre><code>';
			const suffix = '</code></pre>';
			return prefix + highlightCode(codeContent, language) + suffix;
		}
	}
	return parseSaveMarkdown(error);
}

export default async function parseMarkdown(
	markdown: string,
	codeFiles: Map<string, [string, FileStatus]>,
): Promise<[CodeType, string][]> {
	const compiledCode: [CodeType, string][] = [];

	// adds a value to the compiledCode list
	async function addValue(type: CodeType, value: string) {
		if (value === '') return;
		compiledCode.push([type, value]);
	}

	// adds markdown to the compiledCode list
	async function addMarkdown(value: string) {
		addValue(CodeType.Markdown, value);
	}

	// adds mathjax to the compiledCode list
	async function addMathJax(value: string) {
		addValue(CodeType.MathJax, value);
	}

	// adds code to the compiledCode list
	async function addCode(path: string) {
		const code = await getCode(path, codeFiles);
		addValue(CodeType.Code, code);
	}

	// parses breaklines in markdown
	async function extractBreaklines(value: string) {
		const regex = /(\n{2,})/g;
		let match;
		let start = 0;
		// eslint-disable-next-line no-cond-assign
		while ((match = regex.exec(markdown)) != null) {
			const markdownParsed = await parseSaveMarkdown(
				value.substring(start, match.index),
			);
			await addMarkdown(
				`${markdownParsed}${`<br>`.repeat(match[0].length - 1)}`,
			);
			start = regex.lastIndex;
		}
		const markdownParsed = await parseSaveMarkdown(value.substring(start));
		await addMarkdown(markdownParsed);
	}

	// extract MathJax and markdown to compiledCode list
	async function extractMarkdownMathJax(value: string) {
		const regex = /\$(.*?)\$/g;
		let match;
		let start = 0;
		// eslint-disable-next-line no-cond-assign
		while ((match = regex.exec(value)) != null) {
			const mathJax: string = match[1];
			await extractBreaklines(value.substring(start, match.index));
			await addMathJax(mathJax);
			start = regex.lastIndex;
		}
		await extractBreaklines(value.substring(start));
	}

	const regex = /!CodeFile\["(.*)"\]/g;
	let match;
	let start = 0;
	// eslint-disable-next-line no-cond-assign
	while ((match = regex.exec(markdown)) != null) {
		const path: string = match[1];
		await extractMarkdownMathJax(markdown.substring(start, match.index));
		await addCode(path);
		start = regex.lastIndex;
	}
	await extractMarkdownMathJax(markdown.substring(start));

	return compiledCode;
}
