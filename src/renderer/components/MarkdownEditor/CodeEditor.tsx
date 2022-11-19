import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { githubDark } from '@uiw/codemirror-theme-github';

export interface CodeEditorProps {
	code: string;
	onChange: (value: string, ...args: unknown[]) => void;
}

export default function CodeEditor(props: CodeEditorProps) {
	const { code, onChange } = props;
	return (
		<CodeMirror
			className="q-code-editor"
			extensions={[
				markdown({ base: markdownLanguage, codeLanguages: languages }),
			]}
			height="100%"
			value={code}
			theme={githubDark}
			onChange={onChange}
		/>
	);
}
