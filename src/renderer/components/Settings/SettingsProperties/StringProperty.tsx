import { TextInput, FormControl } from '@primer/react';
import './SettingsProperty.scss';
import { SetStateAction, useEffect, useState } from 'react';
import SettingsProperty, { CommonSettingsProperties } from './SettingsProperty';

export interface StringPropertyProps extends CommonSettingsProperties {
	type: 'string' | 'integer' | 'double';
	// eslint-disable-next-line react/require-default-props
	minValue?: number;
	// eslint-disable-next-line react/require-default-props
	maxValue?: number;
}

export default function StringProperty(props: StringPropertyProps) {
	const {
		id,
		header,
		description,
		type,
		defaultValue,
		onValueChange,
		minValue,
		maxValue,
	} = props;
	const [validationResult, setValidationResult] = useState('validName');
	const [value, setValue] = useState(defaultValue);

	const handleInputChange = (e: {
		currentTarget: { value: SetStateAction<string> };
	}) => {
		setValue(e.currentTarget.value);
	};

	useEffect(() => {
		// checks if the value has the correct type
		function checkType(valueToCheck: string): boolean {
			if (type === 'string') return true;
			if (type === 'integer') {
				const intRegEx = /[0-9]+/;
				const result: RegExpMatchArray | null =
					valueToCheck.match(intRegEx);
				if (result == null) return false;
				return (
					result.length === 1 &&
					result[0].length === valueToCheck.length
				);
			}
			if (type === 'double') {
				const doubleRegEx = /[0-9]+\.[0-9]+|[0-9]+/;
				const result: RegExpMatchArray | null =
					valueToCheck.match(doubleRegEx);
				if (result == null) return false;
				return (
					result.length === 1 &&
					result[0].length === valueToCheck.length
				);
			}
			return false;
		}

		// checks if the value is out of range (only for type='double' and type='integer')
		function checkRange(valueToCheck: string): boolean {
			if (type === 'string') return true;
			const number = Number(valueToCheck);
			if (minValue !== undefined && number < minValue) return false;
			if (maxValue !== undefined && number > maxValue) return false;
			return true;
		}

		if (!checkType(value)) {
			setValidationResult('wrongType');
		} else if (!checkRange(value)) {
			setValidationResult('outOfRange');
		} else if (value) {
			setValidationResult('validValue');
			if (onValueChange !== undefined) onValueChange(id, value);
		}
	}, [id, maxValue, minValue, type, value, onValueChange]);

	return (
		<SettingsProperty header={header} description={description}>
			<>
				<FormControl>
					<FormControl.Label visuallyHidden />
					<TextInput
						onChange={handleInputChange}
						defaultValue={defaultValue}
						placeholder={header}
						aria-describedby="custom-id"
						aria-invalid={
							validationResult === 'wrongType' ||
							validationResult === 'outOfRange'
						}
					/>
					{validationResult === 'wrongType' && (
						<FormControl.Validation id="custom-id" variant="error">
							Wrong type. Input should be of type {type}!
						</FormControl.Validation>
					)}
					{validationResult === 'outOfRange' && (
						<FormControl.Validation id="custom-id" variant="error">
							Value is out of range. Must be between {minValue}{' '}
							and {maxValue}!
						</FormControl.Validation>
					)}
					{validationResult === 'validName' && (
						<FormControl.Validation
							id="custom-id"
							variant="success"
						>
							Valid name
						</FormControl.Validation>
					)}
				</FormControl>
			</>
		</SettingsProperty>
	);
}
