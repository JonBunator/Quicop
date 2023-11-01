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
	// eslint-disable-next-line react/require-default-props
	canBeEmpty?: boolean;
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
		canBeEmpty = false,
	} = props;
	const [validationResult, setValidationResult] = useState('validValue');
	const [value, setValue] = useState(defaultValue);

	const handleInputChange = (e: {
		currentTarget: { value: SetStateAction<string> };
	}) => {
		setValue(e.currentTarget.value);
	};

	useEffect(() => {
		// checks if the value is an empty string
		function checkEmpty(valueToCheck: string): boolean {
			if (valueToCheck === undefined) return false;
			return valueToCheck.length > 0;
		}

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

		if (!canBeEmpty && !checkEmpty(value)) {
			setValidationResult('empty');
		} else if (!checkType(value)) {
			setValidationResult('wrongType');
		} else if (!checkRange(value)) {
			setValidationResult('outOfRange');
		} else if (value) {
			setValidationResult('validValue');
			if (onValueChange !== undefined) onValueChange(id, value);
		}
	}, [id, maxValue, minValue, type, value, canBeEmpty, onValueChange]);

	return (
		<SettingsProperty header={header} description={description}>
			<FormControl>
				<FormControl.Label visuallyHidden />
				<TextInput
					onChange={handleInputChange}
					defaultValue={defaultValue}
					sx={type === 'string' ? { width: '100%' } : {}}
					placeholder={header}
					aria-describedby="string-input"
					aria-invalid={
						validationResult === 'empty' ||
						validationResult === 'wrongType' ||
						validationResult === 'outOfRange'
					}
				/>
				{validationResult === 'empty' && (
					<FormControl.Validation id="string-input" variant="error">
						Value can't be empty!
					</FormControl.Validation>
				)}
				{validationResult === 'wrongType' && (
					<FormControl.Validation id="string-input" variant="error">
						Wrong type. Input should be of type {type}!
					</FormControl.Validation>
				)}
				{validationResult === 'outOfRange' && (
					<FormControl.Validation id="string-input" variant="error">
						Value is out of range. Must be between {minValue} and{' '}
						{maxValue}!
					</FormControl.Validation>
				)}
			</FormControl>
		</SettingsProperty>
	);
}
