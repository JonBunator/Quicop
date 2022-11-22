import { themeGet, useTheme } from '@primer/react';
import styled from 'styled-components';
import FileStatus from '../FileStatus';
import CodeEditor from './CodeEditor';
import MarkdownVisualization from '../MarkdownVisualization/MarkdownVisualization';
import './MarkdownEditor.scss';

export interface MarkdownEditorProps {
	code: string;
	onCodeChange: (value: string, ...args: unknown[]) => void;
	codeFiles: Map<string, [string, FileStatus]>;
}
const CodeEditorPanel = styled(CodeEditor)`
	border-right: 1px solid ${themeGet('colors.border.default')};
`;

const MarkdownPanel = styled.div`
	background-color: ${themeGet('colors.canvas.default')};
`;

export default function MarkdownEditor(props: MarkdownEditorProps) {
	const { code, onCodeChange, codeFiles } = props;
	// can be light or dark
	const themeMode = useTheme().resolvedColorMode;
	return (
		<div className="q-editor-panels">
			<CodeEditorPanel code={code} onChange={onCodeChange} />
			<MarkdownPanel className="q-markdown-panel">
				<MarkdownVisualization
					code={code}
					codeFiles={codeFiles}
					dark={themeMode === 'night'}
				/>
			</MarkdownPanel>
		</div>
	);
}
