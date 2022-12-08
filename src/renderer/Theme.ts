import { theme, themeGet } from '@primer/react';
import deepmerge from 'deepmerge';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { createGlobalStyle } from 'styled-components';

export const systemTheme = deepmerge(theme, {
	light: {
		light: {
			colors: {
				marketingIcon: {
					primary: '#85aabc',
					secondary: '#24292e',
				},
			},
		},
		dark: {
			colors: {
				marketingIcon: {
					primary: '#9fbbcc',
					secondary: '#c9d1d9',
				},
			},
		},
	},
});

export const editorThemeLight = createTheme({
	theme: 'light',
	settings: {
		background: '#fff',
		foreground: '#24292e',
		selection: '#85aabc',
		selectionMatch: '#85aabc',
		gutterBackground: '#f6f8fa',
		gutterForeground: '#6e7781',
		lineHighlight: '#9fbbcc55',
	},
	styles: [
		{ tag: [t.comment, t.bracket], color: '#6a737d' },
		{ tag: [t.className, t.propertyName], color: '#6f42c1' },
		{
			tag: [t.variableName, t.attributeName, t.number, t.operator],
			color: '#005cc5',
		},
		{
			tag: [t.keyword, t.typeName, t.typeOperator, t.typeName],
			color: '#d73a49',
		},
		{ tag: [t.string, t.meta, t.regexp], color: '#032f62' },
		{ tag: [t.name, t.quote], color: '#22b32d' },
		{ tag: [t.heading], color: '#615cff', fontWeight: 'bold' },
		{ tag: [t.emphasis], color: '#615cff', fontStyle: 'italic' },
		{ tag: [t.deleted], color: '#b31d28', backgroundColor: 'ffeef0' },
	],
});

// editor themes
export const editorThemeDark = createTheme({
	theme: 'dark',
	settings: {
		background: '#0d1117',
		gutterBackground: '#161b22',
		foreground: '#c9d1d9',
		caret: '#c9d1d9',
		selection: '#003d73',
		selectionMatch: '#003d73',
		lineHighlight: '#36334280',
	},
	styles: [
		{ tag: [t.comment, t.bracket], color: '#8b949e' },
		{ tag: [t.className, t.propertyName], color: '#d2a8ff' },
		{
			tag: [t.variableName, t.attributeName, t.number, t.operator],
			color: '#79c0ff',
		},
		{
			tag: [t.keyword, t.typeName, t.typeOperator, t.typeName],
			color: '#ff7b72',
		},
		{ tag: [t.string, t.meta, t.regexp], color: '#a5d6ff' },
		{ tag: [t.name, t.quote], color: '#7ee787' },
		{ tag: [t.heading], color: '#7f7aff', fontWeight: 'bold' },
		{ tag: [t.emphasis], color: '#7f7aff', fontStyle: 'italic' },
		{ tag: [t.deleted], color: '#ffdcd7', backgroundColor: 'ffeef0' },
	],
});

export const GlobalStyle = createGlobalStyle`
	::-webkit-scrollbar-track {
		background-color: ${themeGet('colors.canvas.subtle')};
	}
	::-webkit-scrollbar-thumb {
		background-color: ${themeGet('colors.border.default')};

			&:hover {
				background-color: ${themeGet('colors.border.subtle')};
			}
			&:active{
				background-color: ${themeGet('colors.border.muted')};
			}
	}
	::-webkit-scrollbar-corner {
		background-color: ${themeGet('colors.canvas.subtle')};
	}
`;
