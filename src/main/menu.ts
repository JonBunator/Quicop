import {
	app,
	Menu,
	shell,
	BrowserWindow,
	MenuItemConstructorOptions,
} from 'electron';

import IpcFunctions from './ipcFunctions';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
	selector?: string;
	submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
	mainWindow: BrowserWindow;

	functions: IpcFunctions;

	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;
		this.functions = new IpcFunctions(mainWindow);
	}

	buildMenu(): Menu {
		if (
			process.env.NODE_ENV === 'development' ||
			process.env.DEBUG_PROD === 'true'
		) {
			this.setupDevelopmentEnvironment();
		}

		const template =
			process.platform === 'darwin'
				? this.buildDarwinTemplate()
				: this.buildDefaultTemplate();

		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);

		return menu;
	}

	setupDevelopmentEnvironment(): void {
		this.mainWindow.webContents.on('context-menu', (_, props) => {
			const { x, y } = props;

			Menu.buildFromTemplate([
				{
					label: 'Inspect element',
					click: () => {
						this.mainWindow.webContents.inspectElement(x, y);
					},
				},
			]).popup({ window: this.mainWindow });
		});
	}

	buildDarwinTemplate(): MenuItemConstructorOptions[] {
		const subMenuAbout: DarwinMenuItemConstructorOptions = {
			label: 'Electron',
			submenu: [
				{
					label: 'About ElectronReact',
					selector: 'orderFrontStandardAboutPanel:',
				},
				{ type: 'separator' },
				{ label: 'Services', submenu: [] },
				{ type: 'separator' },
				{
					label: 'Hide ElectronReact',
					accelerator: 'Command+H',
					selector: 'hide:',
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Shift+H',
					selector: 'hideOtherApplications:',
				},
				{ label: 'Show All', selector: 'unhideAllApplications:' },
				{ type: 'separator' },
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click: () => {
						app.quit();
					},
				},
			],
		};
		const subMenuEdit: DarwinMenuItemConstructorOptions = {
			label: 'Edit',
			submenu: [
				{ label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
				{
					label: 'Redo',
					accelerator: 'Shift+Command+Z',
					selector: 'redo:',
				},
				{ type: 'separator' },
				{ label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
				{ label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
				{
					label: 'Paste',
					accelerator: 'Command+V',
					selector: 'paste:',
				},
				{
					label: 'Select All',
					accelerator: 'Command+A',
					selector: 'selectAll:',
				},
			],
		};
		const subMenuViewDev: MenuItemConstructorOptions = {
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'Command+R',
					click: () => {
						this.mainWindow.webContents.reload();
					},
				},
				{
					label: 'Toggle Full Screen',
					accelerator: 'Ctrl+Command+F',
					click: () => {
						this.mainWindow.setFullScreen(
							!this.mainWindow.isFullScreen()
						);
					},
				},
				{
					label: 'Toggle Developer Tools',
					accelerator: 'Alt+Command+I',
					click: () => {
						this.mainWindow.webContents.toggleDevTools();
					},
				},
			],
		};
		const subMenuViewProd: MenuItemConstructorOptions = {
			label: 'View',
			submenu: [
				{
					label: 'Toggle Full Screen',
					accelerator: 'Ctrl+Command+F',
					click: () => {
						this.mainWindow.setFullScreen(
							!this.mainWindow.isFullScreen()
						);
					},
				},
			],
		};
		const subMenuWindow: DarwinMenuItemConstructorOptions = {
			label: 'Window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'Command+M',
					selector: 'performMiniaturize:',
				},
				{
					label: 'Close',
					accelerator: 'Command+W',
					selector: 'performClose:',
				},
				{ type: 'separator' },
				{ label: 'Bring All to Front', selector: 'arrangeInFront:' },
			],
		};
		const subMenuHelp: MenuItemConstructorOptions = {
			label: 'Help',
			submenu: [
				{
					label: 'Learn More',
					click() {
						shell.openExternal('https://electronjs.org');
					},
				},
				{
					label: 'Documentation',
					click() {
						shell.openExternal(
							'https://github.com/electron/electron/tree/main/docs#readme'
						);
					},
				},
				{
					label: 'Community Discussions',
					click() {
						shell.openExternal(
							'https://www.electronjs.org/community'
						);
					},
				},
				{
					label: 'Search Issues',
					click() {
						shell.openExternal(
							'https://github.com/electron/electron/issues'
						);
					},
				},
			],
		};

		const subMenuView =
			process.env.NODE_ENV === 'development' ||
			process.env.DEBUG_PROD === 'true'
				? subMenuViewDev
				: subMenuViewProd;

		return [
			subMenuAbout,
			subMenuEdit,
			subMenuView,
			subMenuWindow,
			subMenuHelp,
		];
	}

	buildDefaultTemplate() {
		const templateDefault = [
			{
				label: '&File',
				submenu: [
					{
						label: '&Import code file...',
						accelerator: 'Ctrl+I',
						click: () => {
							this.functions.startImportCodeFile();
						},
					},
					{
						label: '&Import code file folder...',
						accelerator: 'Shift+Ctrl+I',
						click: () => {
							this.functions.startImportCodeFileFolder();
						},
					},
					{ type: 'separator' },
					{
						label: '&Export PDF',
						accelerator: 'Ctrl+E',
						click: () => {
							this.functions.startExportPDF();
						},
					},
					{
						label: '&Export PDF to...',
						accelerator: 'Shift+Ctrl+E',
						click: () => {
							this.functions.startExportPDFPath();
						},
					},
					{ type: 'separator' },
					{
						label: '&Settings',
						accelerator: 'Ctrl+,',
						click: () => {
							this.functions.navigateToSettingsPage();
						},
					},
					{
						label: '&Exit',
						accelerator: 'Alt+F4',
						click: () => {
							this.mainWindow.close();
						},
					},
				],
			},
			{
				label: '&Edit',
				submenu: [
					{
						label: '&Refresh code files',
						accelerator: 'Ctrl+s',
						click: () => {
							this.functions.refreshCodeFiles();
						},
					},
					{ type: 'separator' },
					{ role: 'undo' },
					{ role: 'redo' },
					{ type: 'separator' },
					{ role: 'cut' },
					{ role: 'copy' },
					{ role: 'paste' },
					{ role: 'selectAll' },
				],
			},

			{
				label: '&View',
				submenu: [
					{
						label: '&Relaunch application',
						accelerator: 'Ctrl+Shift+r',
						click: () => {
							this.mainWindow.reload();
						},
					},
					{ type: 'separator' },
					{ role: 'resetZoom' },
					{ role: 'zoomIn' },
					{ role: 'zoomOut' },
					{ type: 'separator' },
					{
						label: 'Toggle &Full Screen',
						accelerator: 'F11',
						click: () => {
							this.mainWindow.setFullScreen(
								!this.mainWindow.isFullScreen()
							);
						},
					},
				],
			},
			{
				label: 'Help',
				submenu: [
					{
						label: 'Documentation',
						click() {
							shell.openExternal(
								'https://github.com/JonBunator/Quicop/blob/main/README.md'
							);
						},
					},
					{
						label: 'Releases',
						click() {
							shell.openExternal(
								'https://github.com/JonBunator/Quicop/releases'
							);
						},
					},
					{
						label: 'Bug reports',
						click() {
							shell.openExternal(
								'https://github.com/JonBunator/Quicop/issues'
							);
						},
					},
				],
			},
		];

		return templateDefault;
	}
}
