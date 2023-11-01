import hash from 'renderer/helper/HelperFunctions';
import { CodeType } from './CodeFileParser';
import CodePortionVisualizer from './CodePortionVisualizer';
import './MarkdownVisualization.scss';
import MathJaxRenderer from './MathJax/MathJaxRenderer';

export interface MarkdownVisualizationProps {
	markdownParsed: [CodeType, string][];
	dark: boolean;
}

export default function MarkdownVisualization(
	props: MarkdownVisualizationProps,
) {
	const { markdownParsed } = props;

	function isDarkTheme() {
		const { dark } = props;
		return dark ? ' q-dark' : ' q-light';
	}

	return (
		<div className={`q-markdown-visualization${isDarkTheme()}`}>
			{markdownParsed.map(
				(item: [CodeType, string], index: number) =>
					(item[0] === CodeType.MathJax && (
						<MathJaxRenderer
							key={hash(item[1] + index)}
							expression={item[1]}
						/>
					)) || (
						<CodePortionVisualizer
							key={hash(item[1] + index)}
							code={item[1]}
						/>
					),
			)}
		</div>
	);
}
