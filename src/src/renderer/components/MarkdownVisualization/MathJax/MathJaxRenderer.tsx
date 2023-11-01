// Code adapted from https://github.com/rhysd/react-mathjax-component

import type { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';
import render from './LiteDom';
import { useMathJaxProvider } from './MathJaxProvider';

export interface MathJaxRendererProps {
	expression: string;
}

export default function MathJaxRenderer(props: MathJaxRendererProps) {
	const { expression } = props;
	const mathJaxProvider = useMathJaxProvider();
	if (mathJaxProvider === undefined || mathJaxProvider.document === undefined)
		return <p />;
	const node = mathJaxProvider.document?.convert(expression) as LiteElement;
	const children = render(node.children);
	return <p>{children}</p>;
}
