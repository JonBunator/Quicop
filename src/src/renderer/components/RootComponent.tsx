import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownEditor from './MarkdownEditor/MarkdownEditor';
import MarkdownParserProvider from './MarkdownVisualization/MarkdownParserProvider';
import PdfExportView from './PdfExportView';

export default function RootComponent() {
	const [defaultView, setDefaultView] = useState(true);
	const [path, setPath] = useState('');

	useEffect(() => {
		// pdf export with path started
		window.electronAPI.onExportPDFPathStarted(async () => {
			const filePath = await window.electronAPI.saveFile();
			setPath(filePath);
			setDefaultView(false);
		});
	}, []);

	useEffect(() => {
		// pdf export without path started
		window.electronAPI.onExportPDFStarted(() => {
			setPath('');
			setDefaultView(false);
		});
	}, []);

	useEffect(() => {
		// pdf export finished
		window.electronAPI.onExportPDFFinished(() => {
			setPath('');
			setDefaultView(true);
		});
	}, []);

	// navigate to settings page
	const navigate = useNavigate();
	useEffect(() => {
		window.electronAPI.onNavigateToSettingsPage(() => {
			navigate('/settings');
		});
		return () => {
			window.electronAPI.removeAllNavigateToSettingsPageListeners();
		};
	}, [navigate]);

	return (
		<MarkdownParserProvider>
			{defaultView && <MarkdownEditor />}
			{!defaultView && <PdfExportView path={path} />}
		</MarkdownParserProvider>
	);
}
