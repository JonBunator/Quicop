import { useEffect } from 'react';
import MarkdownVisualization from './MarkdownVisualization/MarkdownVisualization';
import { useMarkdownParser } from './MarkdownVisualization/MarkdownParserProvider';

export interface PdfExportViewProps {
	path: string;
}

export default function PdfExportView(props: PdfExportViewProps) {
	const { path } = props;
	const markdownParser = useMarkdownParser();

	useEffect(() => {
		window.electronAPI.exportPDF(path);
	}, [path]);
	return (
		<MarkdownVisualization
			markdownParsed={markdownParser?.markdownParsed ?? ''}
			dark={false}
		/>
	);
}
