import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("electronAPI", {
    exportPDF: (path : string) => ipcRenderer.send('exportPDF', path),
    onExportPDFFinished: (func: (...args: unknown[]) => void) => ipcRenderer.on('exportPDFFinished', func),
    onExportPDFStarted: (func: (...args: unknown[]) => void) => ipcRenderer.on('exportPDFStarted', func),
    onExportPDFPathStarted: (func: (...args: unknown[]) => void) => ipcRenderer.on('exportPDFPathStarted', func),
    onImportCodeFileFolder: (func: (...args: unknown[]) => void) => ipcRenderer.on('onImportCodeFileFolder', func),
    onImportCodeFile: (func: (...args: unknown[]) => void) => ipcRenderer.on('onImportCodeFile', func),
    exportPDFFinished: () => ipcRenderer.send('exportPDFFinished'),
    saveFile: () => ipcRenderer.invoke('saveFile'),
    openFile: () => ipcRenderer.invoke('openFile'),
    openFolder: () => ipcRenderer.invoke('openFolder'),
    readFilePaths: (path : string) => ipcRenderer.invoke('readFilePaths', path),
    loadFile: (path : string) => ipcRenderer.invoke('loadFile', path)
})