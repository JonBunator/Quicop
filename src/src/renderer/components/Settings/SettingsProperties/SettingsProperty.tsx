import { Text, themeGet } from '@primer/react';
import './SettingsProperty.scss';
import styled from 'styled-components';

export interface CommonSettingsProperties {
	id: string;
	header: string;
	description: string;
	defaultValue: string;
	// eslint-disable-next-line react/require-default-props
	onValueChange?: (id: string, value: string) => void;
}

export interface SettingsPropertyProps {
	header: string;
	// eslint-disable-next-line react/require-default-props
	description?: string;
	children: JSX.Element;
}

const SettingsPropertyElement = styled.div`
	:hover {
		background-color: ${themeGet('colors.canvas.subtle')};
	}
`;

export default function SettingsProperty(props: SettingsPropertyProps) {
	const { header, description, children } = props;
	return (
		<SettingsPropertyElement className="settings-property">
			<Text className="header" color="fg.default">
				{header}
			</Text>
			<Text className="description" color="fg.muted">
				{description}
			</Text>
			{children}
		</SettingsPropertyElement>
	);
}
