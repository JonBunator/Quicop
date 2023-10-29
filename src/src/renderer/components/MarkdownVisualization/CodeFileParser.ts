import { marked } from 'marked';
import hljs from 'highlight.js';
import './MarkdownVisualization.scss';
import FileStatus from '../FileStatus';

export enum CodeType {
	Markdown,
	MathJax,
	Code,
}

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

function getCode(key: string, codeFiles: Map<string, [string, FileStatus]>) {
	let error = `\`\`\`bash\nFile "${key}" is not cached. Press F5 to refresh!\n\`\`\``;
	if (codeFiles.has(key)) {
		// get file extension
		const [codeContent, fileStatus]: [string, FileStatus] =
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
				((key.lastIndexOf('.') - 1) >>> 0) + 2
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
	codeFiles: Map<string, [string, FileStatus]>
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
		compiledCode.push([type, value]);
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
		// Add break lines for empty lines
		const cleanedValue = value.replace(/\n+/g, (match) => {
			return match.length === 1
				? '\n'
				: '<br></br>'.repeat(match.length - 1);
		});

		const regex = /\$(.*)\$/g;
		let match;
		let start = 0;
		// eslint-disable-next-line no-cond-assign
		while ((match = regex.exec(cleanedValue)) != null) {
			const mathJax: string = match[1];
			addValue(
				CodeType.Markdown,
				marked.parse(cleanedValue.substring(start, match.index))
			);
			addMathJax(mathJax);
			start = regex.lastIndex;
		}
		addValue(
			CodeType.Markdown,
			marked.parse(cleanedValue.substring(start))
		);
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
