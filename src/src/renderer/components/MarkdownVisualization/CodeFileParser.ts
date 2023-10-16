import { marked } from 'marked';
import hljs from 'highlight.js';
import './MarkdownVisualization.scss';
import FileStatus from '../FileStatus';

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
) {
	marked.setOptions({
		langPrefix: 'hljs language-',
		highlight: highlightCode,
		breaks: true,
	});

	const regex = /!CodeFile\["(.*)"\]/g;
	let compiledCode = '';
	let match;
	let start = 0;
	// eslint-disable-next-line no-cond-assign
	while ((match = regex.exec(markdown)) != null) {
		const path: string = match[1];
		compiledCode += marked.parse(markdown.substring(start, match.index));
		compiledCode += getCode(path, codeFiles);
		start = regex.lastIndex;
	}
	compiledCode += marked.parse(markdown.substring(start));
	return compiledCode;
}
