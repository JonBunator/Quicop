import { FormControl, Select } from '@primer/react';
import { ChangeEvent } from 'react';
import './SettingsProperty.scss';
import SettingsProperty, { CommonSettingsProperties } from './SettingsProperty';

export interface EnumPropertyProps extends CommonSettingsProperties {
	values: string[];
	displayValues: string[];
}

export default function EnumProperty(props: EnumPropertyProps) {
	const {
		id,
		header,
		description,
		values,
		displayValues,
		defaultValue,
		onValueChange,
	} = props;

	const handleInputChange = (
		e: ChangeEvent<HTMLSelectElement> | undefined
	) => {
		const newValue = e?.target.value;
		if (newValue !== undefined) {
			if (onValueChange !== undefined) onValueChange(id, newValue);
		}
	};

	return (
		<SettingsProperty header={header} description={description}>
			<>
				<FormControl>
					<FormControl.Label visuallyHidden />
					<Select
						defaultValue={defaultValue}
						onChange={handleInputChange}
					>
						<>
							{values.map((currentValue, index) => (
								<Select.Option
									key={currentValue}
									value={currentValue}
								>
									{displayValues[index]}
								</Select.Option>
							))}
						</>
					</Select>
				</FormControl>
			</>
		</SettingsProperty>
	);
}
