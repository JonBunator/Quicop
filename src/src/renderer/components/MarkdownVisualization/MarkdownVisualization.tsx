import './MarkdownVisualization.scss';

export interface MarkdownVisualizationProps {
	markdownParsed: string;
	dark: boolean;
}

export default function MarkdownVisualization(
	props: MarkdownVisualizationProps
) {
	const { markdownParsed } = props;

	function isDarkTheme() {
		const { dark } = props;
		return dark ? ' q-dark' : ' q-light';
	}

	return (
		<div
			className={`q-markdown-visualization${isDarkTheme()}`}
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: markdownParsed }}
		/>
	);
}
