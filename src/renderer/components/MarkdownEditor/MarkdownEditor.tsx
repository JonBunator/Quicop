import CodeEditor from '../CodeEditor';
import FileStatus from '../FileStatus';
import MarkdownVisualization from '../MarkdownVisualization/MarkdownVisualization';
import './MarkdownEditor.scss';

export interface MarkdownEditorProps {
	code: string;
	onCodeChange: (value: string, ...args: unknown[]) => void;
	codeFiles: Map<string, [string, FileStatus]>;
}

export default function MarkdownEditor(props: MarkdownEditorProps) {
	const { code, onCodeChange, codeFiles } = props;
	return (
		<div className="q-editor-panels">
			<CodeEditor code={code} onChange={onCodeChange} />
			<div className="q-markdown-panel">
				<MarkdownVisualization code={code} codeFiles={codeFiles} dark />
			</div>
		</div>
	);
}
