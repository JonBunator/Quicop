// Code adapted from https://github.com/rhysd/react-mathjax-component

import { createElement } from 'react';
import type {
	LiteElement,
	LiteNode,
} from 'mathjax-full/js/adaptors/lite/Element';
import type { LiteText } from 'mathjax-full/js/adaptors/lite/Text';

function isLiteText(node: LiteNode): node is LiteText {
	return node.kind === '#text';
}

interface Style {
	[name: string]: string;
}

// Convert cebab-case into camelCase. `camelCase` function from 'camel-case' npm package is slower because it does not
// know the input is in cebab-case. This function is about 1.5x faster than it.
const DELIMITER = /[:-]/;
function camelize(name: string): string {
	if (!DELIMITER.test(name)) {
		return name;
	}
	const parts = name.split(DELIMITER);
	for (let i = 1; i < parts.length; i += 1) {
		const part = parts[i];
		if (part.length > 0) {
			parts[i] = part[0].toUpperCase() + part.slice(1);
		}
	}
	return parts.join('');
}

function parseStyle(text: string): Style {
	const style: Style = {};
	text.split(';').forEach((s) => {
		const [name, val] = s.split(':');
		style[camelize(name)] = val;
	});
	return style;
}

interface Props {
	key: string | number;
	style?: Style;
	[key: string]: unknown;
}

function propsForLiteElement(elem: LiteElement, key: number | string): Props {
	const props: Props = { key };
	let style = '';
	Object.keys(elem.attributes).forEach((name) => {
		const value = elem.attributes[name];
		if (name.startsWith('data-') || name.startsWith('aria-')) {
			props[name] = value;
		} else if (name === 'style') {
			style = value;
		} else {
			props[camelize(name)] = value;
		}
	});
	if (elem.styles !== null) {
		style += elem.styles.cssText;
	}
	if (style.length > 0) {
		props.style = parseStyle(style);
	}
	return props;
}

export default function render(nodes: LiteNode[]): React.ReactNode[] {
	return nodes.map((node, idx) => {
		if (isLiteText(node)) {
			return node.value;
		}
		return createElement(
			node.kind,
			propsForLiteElement(node, idx),
			...render(node.children)
		);
	});
}
