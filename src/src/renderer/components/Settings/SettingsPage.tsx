import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Button, Box, Text, themeGet } from '@primer/react';
import styled from 'styled-components';
import EnumProperty from './SettingsProperties/EnumProperty';
import { useSettings } from './SettingsProvider';
import StringProperty from './SettingsProperties/StringProperty';

const SettingsPagePanel = styled.div`
	background-color: ${themeGet('colors.canvas.default')};
	margin-bottom: 32px;
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

	// header content
	function Header() {
		return (
			<Box
				display="flex"
				alignItems="flex-end"
				borderColor="border.default"
				borderBottomWidth={1}
				borderBottomStyle="solid"
				position="sticky"
				top={0}
				pt={5}
				px={2}
				pb={3}
				mb={4}
				backgroundColor="canvas.default"
				zIndex={1}
			>
				<Box color="fg.default" fontSize="1.8rem">
					Settings
				</Box>
				<Box ml="auto">
					<Button onClick={exitSettingsPage}>Close</Button>
				</Box>
			</Box>
		);
	}

	return (
		<SettingsPagePanel>
			<Box marginX="clamp(15px, 5%, 100px);">
				<Header />
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
					<Text color="fg.default" fontSize="1.5rem">
						PDF-Export
					</Text>
					<StringProperty
						id="default-file-name"
						header="Default Filename"
						description="Sets the default filename of the exported pdf file."
						type="string"
						defaultValue={
							settings?.getSettingsProperty(
								'default-file-name'
							) as string
						}
						onValueChange={propertyChanged}
					/>

					<StringProperty
						id="top-margin"
						header="Top Margin"
						description="Sets the top margin of the exported pdf file in centimeters."
						type="double"
						minValue={0}
						maxValue={10}
						defaultValue={
							settings?.getSettingsProperty(
								'top-margin'
							) as string
						}
						onValueChange={propertyChanged}
					/>

					<StringProperty
						id="bottom-margin"
						header="Bottom Margin"
						description="Sets the bottom margin of the exported pdf file in centimeters."
						type="double"
						minValue={0}
						maxValue={10}
						defaultValue={
							settings?.getSettingsProperty(
								'bottom-margin'
							) as string
						}
						onValueChange={propertyChanged}
					/>

					<StringProperty
						id="left-margin"
						header="Left Margin"
						description="Sets the left margin of the exported pdf file in centimeters."
						type="double"
						minValue={0}
						maxValue={10}
						defaultValue={
							settings?.getSettingsProperty(
								'left-margin'
							) as string
						}
						onValueChange={propertyChanged}
					/>

					<StringProperty
						id="right-margin"
						header="Right Margin"
						description="Sets the right margin of the exported pdf file in centimeters."
						type="double"
						minValue={0}
						maxValue={10}
						defaultValue={
							settings?.getSettingsProperty(
								'right-margin'
							) as string
						}
						onValueChange={propertyChanged}
					/>

					<StringProperty
						id="footer-template"
						header="Footer Template"
						description="Template for the footer. Allows the following values to be injected: pageNumber (Current page number), totalPages (Total number of pages), date (Current date). They should be formatted like this {pageNumber}."
						type="string"
						defaultValue={
							settings?.getSettingsProperty(
								'footer-template'
							) as string
						}
						onValueChange={propertyChanged}
					/>

					<StringProperty
						id="header-template"
						header="Header Template"
						description="Template for the header. Supports the same format as the footer template."
						type="string"
						canBeEmpty
						defaultValue={
							settings?.getSettingsProperty(
								'header-template'
							) as string
						}
						onValueChange={propertyChanged}
					/>
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
