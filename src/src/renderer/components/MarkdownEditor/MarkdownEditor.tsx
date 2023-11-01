import { themeGet, useTheme } from '@primer/react';
import { useCallback } from 'react';
import styled from 'styled-components';
import Split from 'react-split';
import CodeEditor from './CodeEditor';
import MarkdownVisualization from '../MarkdownVisualization/MarkdownVisualization';
import './MarkdownEditor.scss';
import { useMarkdownParser } from '../MarkdownVisualization/MarkdownParserProvider';

const MarkdownPanel = styled.div`
	background-color: ${themeGet('colors.canvas.default')};
`;

export default function MarkdownEditor() {
	const markdownParser = useMarkdownParser();

	const onCodeChange = useCallback(
		(value: string) => {
			markdownParser?.setMarkdown(value);
		},
		[markdownParser],
	);

	// can be light or dark
	const themeMode = useTheme().resolvedColorMode;
	return (
		<Split className="q-editor-panels">
			<CodeEditor
				code={markdownParser?.markdown ?? ''}
				onChange={onCodeChange}
			/>
			<MarkdownPanel className="q-markdown-panel">
				<MarkdownVisualization
					markdownParsed={markdownParser?.markdownParsed ?? []}
					dark={themeMode === 'night'}
				/>
			</MarkdownPanel>
		</Split>
	);
}
