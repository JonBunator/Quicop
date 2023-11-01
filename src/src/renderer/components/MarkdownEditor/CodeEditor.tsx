import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { MarkdownConfig } from '@lezer/markdown';
import { styleTags, tags } from '@lezer/highlight';
import { useTheme } from '@primer/react';
import { editorThemeDark, editorThemeLight } from 'renderer/components/Theme';
import { useMemo } from 'react';

export interface CodeEditorProps {
	code: string;
	onChange: (value: string) => void;
	// eslint-disable-next-line react/require-default-props
	className?: string;
}

const PathsDelim = { resolve: 'Path', mark: 'PathMark' };

// highlights paths ("...")
const MarkPaths: MarkdownConfig = {
	defineNodes: ['Path', 'PathMark'],
	parseInline: [
		{
			name: 'Path',
			parse(cx, next, pos) {
				// 34 is ascii code for "
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

const MathJaxDelim = { resolve: 'MathJax', mark: 'MathJaxMark' };

// highlights MathJax $x = {-b \pm \sqrt{b^2-4ac} \over 2a}$
const MarkMathJax: MarkdownConfig = {
	defineNodes: ['MathJax', 'MathJaxMark'],
	parseInline: [
		{
			name: 'MathJax',
			parse(cx, next, pos) {
				// 36 is ascii code for $
				if (next !== 36) return -1;
				return cx.addDelimiter(MathJaxDelim, pos, pos + 1, true, true);
			},
			after: 'Emphasis',
		},
	],
	props: [
		styleTags({
			MathJax: tags.string,
			MathJaxMark: tags.keyword,
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
					cx.text.slice(pos - cx.offset),
				);
				if (match) {
					return cx.addElement(
						cx.elt('CodeFilesExclamation', pos, pos + 1, [
							cx.elt('CodeFilesKeyword', pos + 1, pos + 9),
						]),
					);
				}
				return -1;
			},
			after: 'Emphasis',
		},
	],
	props: [
		styleTags({
			CodeFilesExclamation: tags.keyword,
			CodeFilesKeyword: tags.heading1,
		}),
	],
};

export default function CodeEditor(props: CodeEditorProps) {
	const { code, onChange, className } = props;
	// can be light or dark
	const themeMode = useTheme().resolvedColorMode;

	const editorExtensions = useMemo(() => {
		return [
			markdown({
				base: markdownLanguage,
				codeLanguages: languages,
				extensions: [MarkCodeFiles, MarkPaths, MarkMathJax],
			}),
		];
	}, []);

	return (
		<CodeMirror
			className={`q-code-editor ${className}`}
			extensions={editorExtensions}
			height="100%"
			value={code}
			theme={themeMode === 'night' ? editorThemeDark : editorThemeLight}
			onChange={onChange}
		/>
	);
}
