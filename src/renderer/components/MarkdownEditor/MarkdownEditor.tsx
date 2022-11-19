import IconButton from '@mui/material/IconButton';
import SyncIcon from '@mui/icons-material/Sync';
import Tooltip from '@mui/material/Tooltip';
import CodeEditor from './CodeEditor';
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
	// const versionString = process.env.npm_package_version;
	return (
		<div className="q-editor-main-window">
			<div className="q-editor-panels">
				<CodeEditor code={code} onChange={onCodeChange} />
				<div className="q-markdown-panel">
					<MarkdownVisualization
						code={code}
						codeFiles={codeFiles}
						dark
					/>
				</div>
			</div>
			<div className="q-editor-footer">
				<div className="q-editor-footer-version">v1.0.1</div>
				<Tooltip title="Refresh code files" arrow>
					<IconButton size="small">
						<SyncIcon />
					</IconButton>
				</Tooltip>
			</div>
		</div>
	);
}
