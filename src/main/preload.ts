import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("electronAPI", {
    exportPDF: (path : string) => ipcRenderer.send('exportPDF', path),
    onExportPDFFinished: (func: (...args: unknown[]) => void) => ipcRenderer.on('exportPDFFinished', func),
    onExportPDFStarted: (func: (...args: unknown[]) => void) => ipcRenderer.on('exportPDFStarted', func),
    onExportPDFPathStarted: (func: (...args: unknown[]) => void) => ipcRenderer.on('exportPDFPathStarted', func),
    exportPDFFinished: () => ipcRenderer.send('exportPDFFinished'),
    saveFile: () => ipcRenderer.invoke('saveFile')
})