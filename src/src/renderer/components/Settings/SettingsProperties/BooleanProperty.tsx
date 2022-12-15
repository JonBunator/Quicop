import { Checkbox, FormControl, Text } from '@primer/react';
import './SettingsProperty.scss';
import { useEffect, useState } from 'react';
import SettingsProperty, { CommonSettingsProperties } from './SettingsProperty';

export interface BooleanPropertyProps
	extends Omit<CommonSettingsProperties, 'defaultValue'> {
	defaultValue: 'true' | 'false';
}

export default function BooleanProperty(props: BooleanPropertyProps) {
	const { id, header, description, defaultValue, onValueChange } = props;
	const defaultValueBoolean: boolean = defaultValue === 'true';
	const [value, setValue] = useState(defaultValueBoolean);
	const handleInputChange = () => {
		setValue((prev) => !prev);
	};

	useEffect(() => {
		if (onValueChange !== undefined)
			onValueChange(id, value ? 'true' : 'false');
	}, [id, value, onValueChange]);

	return (
		<SettingsProperty header={header}>
			<>
				<FormControl>
					<Checkbox
						defaultChecked={defaultValueBoolean}
						onChange={handleInputChange}
					/>
					<FormControl.Label>
						<Text className="description" color="fg.muted">
							{description}
						</Text>
					</FormControl.Label>
				</FormControl>
			</>
		</SettingsProperty>
	);
}
