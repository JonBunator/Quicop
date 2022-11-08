import { marked } from 'marked';
import hljs from 'highlight.js';
import './MarkdownVisualization.scss';
import FileStatus from '../FileStatus';

export default function MarkdownVisualization(props : any) {
	marked.setOptions({
        langPrefix: "hljs language-",
        highlight: highlightCode,
		breaks: true,
	});

	function highlightCode(code: string, lang : string) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(code, {language: lang}).value;
			} catch (err) {}
		}

		try {
			return hljs.highlightAuto(code).value;
		} catch (err) {}
		return '';
	}

    function getCode(key : string) {
		let error = "```bash\nFile \"" + key + "\" is not cached. Click refresh!\n```";
        if(props.codeFiles.has(key)) {
			//get file extension
			const [code, fileStatus] : [string, FileStatus] = props.codeFiles.get(key)
			if(fileStatus == FileStatus.BinaryFileError) {
				error = "```bash\nBinary file with path \"" + key + "\" is not displayable!\n```";

			} else if(fileStatus == FileStatus.PathNotFoundError) {
				error = "```bash\nFile with path \"" + key + "\" was not found!\n```";

			} else if(fileStatus == FileStatus.Success) {
				const language = key.slice((key.lastIndexOf(".") - 1 >>> 0) + 2);
				const prefix = "<pre><code>";
				const suffix = "</code></pre>";
				return prefix + highlightCode(code, language) + suffix;
			}
        }
        return marked.parse(error);
    }

    function parseSpecialMarkdown() {
        const regex = /!CodeFile\["(.*)"\]/g;
        let compiledCode = ""
        let code = props.code;
        let match;
        let start = 0;
        while ((match = regex.exec(props.code)) != null) {
            let path : string = match[1];
            compiledCode += marked.parse(code.substring(start, match.index))
            compiledCode += getCode(path)
            start = regex.lastIndex
        }
        compiledCode += marked.parse(code.substring(start))
        return compiledCode;
    }

    function createMarkup() {
        return {__html : parseSpecialMarkdown()}
    }

    function isDarkTheme() {
        return props.dark ? ' q-dark' : ' q-light';
    }

    return(
        <div className={'q-markdown-visualization' + isDarkTheme()} dangerouslySetInnerHTML={createMarkup()} />
    )
}
