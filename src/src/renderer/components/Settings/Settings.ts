import data from './settingsConfig.json';

export interface Settings {
	sections: Section[];
}

export interface Section {
	header: string;
	properties: Property[];
}

export interface Property {
	id: string;
	header: string;
	description: string;
	defaultValue: string;
	specializedProp: Enum | NumberInput | StringInput;
}

export interface Enum {
	type: 'enum';
	values: Array<string[]>;
}

export interface NumberInput {
	type: 'numberInput';
	minValue: number;
	maxValue: number;
}

export interface StringInput {
	type: 'stringInput';
}

export const settingsData: Settings = JSON.parse(
	JSON.stringify(data),
	(key, value) => {
		if (key === 'specializedProp') {
			if (value.type === 'enum') {
				return value as Enum;
			}
			if (value.type === 'numberInput') {
				return value as NumberInput;
			}

			if (value.type === 'stringInput') {
				return value as StringInput;
			}
		}

		return value;
	}
);
