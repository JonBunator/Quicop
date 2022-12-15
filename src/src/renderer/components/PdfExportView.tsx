import { useEffect } from 'react';
import FileStatus from './FileStatus';
import MarkdownVisualization from './MarkdownVisualization/MarkdownVisualization';

export interface PdfExportViewProps {
	code: string;
	path: string;
	codeFiles: Map<string, [string, FileStatus]>;
}

export default function PdfExportView(props: PdfExportViewProps) {
	const { code, path, codeFiles } = props;
	useEffect(() => {
		window.electronAPI.exportPDF(path);
	}, [path]);
	return (
		<MarkdownVisualization code={code} codeFiles={codeFiles} dark={false} />
	);
}
