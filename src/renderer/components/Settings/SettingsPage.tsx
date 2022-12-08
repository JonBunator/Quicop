import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Button, Box, Text, themeGet } from '@primer/react';
import './SettingsPage.scss';
import styled from 'styled-components';
import EnumProperty from './SettingsProperties/EnumProperty';
import { useSettings } from './SettingsProvicer';

const SettingsPagePanel = styled.div`
	background-color: ${themeGet('colors.canvas.default')};
`;

export default function SettingsPage() {
	const navigate = useNavigate();
	const settings = useSettings();

	const exitSettingsPage = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	const propertyChanged = async (id: string, value: string) => {
		settings?.setSettingsProperty(id, value);
	};

	return (
		<SettingsPagePanel className="q-settings-page">
			<Box marginX="clamp(15px, 5%, 100px);">
				<Box
					display="flex"
					alignItems="flex-end"
					borderColor="border.default"
					borderBottomWidth={1}
					borderBottomStyle="solid"
					pt={5}
					px={2}
					pb={3}
					mb={4}
				>
					<Box color="fg.default" fontSize="1.8rem">
						Settings
					</Box>
					<Box ml="auto">
						<Button onClick={exitSettingsPage}>Close</Button>
					</Box>
				</Box>
				<Box mx={8}>
					<Text color="fg.default" fontSize="1.5rem">
						General
					</Text>
					<EnumProperty
						id="color-mode"
						header="Color Mode"
						description="Select the color theme of the application. If 'auto' is set, the operating system preference is used to set the correct theme."
						values={['auto', 'night', 'day']}
						displayValues={['Auto', 'Dark', 'Light']}
						defaultValue={
							settings?.getSettingsProperty(
								'color-mode'
							) as string
						}
						onValueChange={propertyChanged}
					/>
					<Text color="fg.default" fontSize="1rem">
						More settings coming soonish..
					</Text>
					{/*
					<BooleanProperty
						id="auto-updates"
						header="Enable auto updates"
						description="If this property is set to true, updates will be automatically downloaded when a new release comes out."
						defaultValue="true"
						onValueChange={propertyChanged}
					/>
					<EnumProperty
						id="pdf-color-mode"
						header="PDF Color Mode"
						description="Select the color theme of the exported PDF."
						values={['light', 'dark']}
						displayValues={['Light', 'Dark']}
						defaultValue="light"
						onValueChange={propertyChanged}
					/>
					<StringProperty
						id="limit-file-imports"
						header="Limit file imports"
						description="This limits the number of file you can import via 'Import code file folder'. This is to ensure that the application does not crash when you import a folder with too many files."
						type="integer"
						minValue={1}
						maxValue={10000}
						defaultValue="50"
						onValueChange={propertyChanged}
					/>
					*/}
				</Box>
			</Box>
		</SettingsPagePanel>
	);
}
