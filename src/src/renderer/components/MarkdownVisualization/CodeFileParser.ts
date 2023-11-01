import { marked } from 'marked';
import hljs from 'highlight.js';
import './MarkdownVisualization.scss';
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

function getCode(key: string, codeFiles: Map<string, [string, FileStatus]>) {
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
	return marked.parse(error);
}

export default async function parseMarkdown(
	markdown: string,
	codeFiles: Map<string, [string, FileStatus]>,
): Promise<[CodeType, string][]> {
	marked.setOptions({
		langPrefix: 'hljs language-',
		highlight: highlightCode,
		breaks: true,
	});

	const compiledCode: [CodeType, string][] = [];

	// adds a value to the compiledCode list
	function addValue(type: CodeType, value: string) {
		if (value === '') return;

		let newValue = value;

		if (type === CodeType.Markdown) {
			// Add break lines for empty lines
			newValue = value.replace(/\n+/g, (match) => {
				return match.length === 1
					? '\n'
					: '<br></br>'.repeat(match.length - 1);
			});
			newValue = marked(newValue);
		}
		compiledCode.push([type, newValue]);
	}

	// adds mathjax to the compiledCode list
	function addMathJax(value: string) {
		addValue(CodeType.MathJax, value);
	}

	// adds code to the compiledCode list
	function addCode(value: string) {
		addValue(CodeType.Code, value);
	}

	// extract MathJax and markdown to compiledCode list
	function addMarkdown(value: string) {
		const regex = /\$(.*?)\$/g;
		let match;
		let start = 0;
		// eslint-disable-next-line no-cond-assign
		while ((match = regex.exec(value)) != null) {
			const mathJax: string = match[1];
			addValue(CodeType.Markdown, value.substring(start, match.index));
			addMathJax(mathJax);
			start = regex.lastIndex;
		}
		addValue(CodeType.Markdown, value.substring(start));
	}

	const regex = /!CodeFile\["(.*)"\]/g;
	let match;
	let start = 0;
	// eslint-disable-next-line no-cond-assign
	while ((match = regex.exec(markdown)) != null) {
		const path: string = match[1];
		addMarkdown(markdown.substring(start, match.index));
		addCode(getCode(path, codeFiles));
		start = regex.lastIndex;
	}
	addMarkdown(markdown.substring(start));
	return compiledCode;
}
