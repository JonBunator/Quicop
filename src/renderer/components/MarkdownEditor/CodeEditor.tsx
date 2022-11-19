import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { githubDark } from '@uiw/codemirror-theme-github';
import { MarkdownConfig } from '@lezer/markdown';
import { styleTags, tags } from '@lezer/highlight';

export interface CodeEditorProps {
	code: string;
	onChange: (value: string, ...args: unknown[]) => void;
}

const PathsDelim = { resolve: 'Path', mark: 'PathMark' };

// highlights paths ("...")
const MarkPaths: MarkdownConfig = {
	defineNodes: ['Path', 'PathMark'],
	parseInline: [
		{
			name: 'Highlight',
			parse(cx, next, pos) {
				if (next !== 34) return -1;
				return cx.addDelimiter(PathsDelim, pos, pos + 1, true, true);
			},
			after: 'Emphasis',
		},
	],
	props: [
		styleTags({
			PathMark: tags.literal,
			Path: tags.string,
		}),
	],
};

// highlights the keyword !CodeFiles["..."]
const MarkCodeFiles: MarkdownConfig = {
	defineNodes: ['CodeFilesExclamation', 'CodeFilesKeyword'],
	parseInline: [
		{
			name: 'CodeFiles',
			parse(cx, _next, pos) {
				const match = /^!CodeFile\["(.*)"\]/.exec(
					cx.text.slice(pos - cx.offset)
				);
				if (match) {
					return cx.addElement(
						cx.elt('CodeFilesExclamation', pos, pos + 1, [
							cx.elt('CodeFilesKeyword', pos + 1, pos + 9),
						])
					);
				}
				return -1;
			},
			after: 'Emphasis',
		},
	],
	props: [
		styleTags({
			CodeFilesExclamation: tags.arithmeticOperator,
			CodeFilesKeyword: tags.heading1,
		}),
	],
};

export default function CodeEditor(props: CodeEditorProps) {
	const { code, onChange } = props;
	return (
		<CodeMirror
			className="q-code-editor"
			extensions={[
				markdown({
					base: markdownLanguage,
					codeLanguages: languages,
					extensions: [MarkCodeFiles, MarkPaths],
				}),
			]}
			height="100%"
			value={code}
			theme={githubDark}
			onChange={onChange}
		/>
	);
}
