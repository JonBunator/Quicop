import { themeGet, useTheme } from '@primer/react';
import styled from 'styled-components';
import Split from 'react-split';
import FileStatus from '../FileStatus';
import CodeEditor from './CodeEditor';
import MarkdownVisualization from '../MarkdownVisualization/MarkdownVisualization';
import './MarkdownEditor.scss';

export interface MarkdownEditorProps {
	code: string;
	onCodeChange: (value: string, ...args: unknown[]) => void;
	codeFiles: Map<string, [string, FileStatus]>;
}

const MarkdownPanel = styled.div`
	background-color: ${themeGet('colors.canvas.default')};
`;

export default function MarkdownEditor(props: MarkdownEditorProps) {
	const { code, onCodeChange, codeFiles } = props;
	// can be light or dark
	const themeMode = useTheme().resolvedColorMode;
	return (
		<Split className="q-editor-panels">
			<CodeEditor code={code} onChange={onCodeChange} />
			<MarkdownPanel className="q-markdown-panel">
				<MarkdownVisualization
					code={code}
					codeFiles={codeFiles}
					dark={themeMode === 'night'}
				/>
			</MarkdownPanel>
		</Split>
	);
}
