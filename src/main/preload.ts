import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("electronAPI", {
    exportPDF: () => ipcRenderer.send('exportPDF'),
    onExportPDFFinished: (func: (...args: unknown[]) => void) => ipcRenderer.on('exportPDFFinished', func),
    onExportPDFStarted: (func: (...args: unknown[]) => void) => ipcRenderer.on('exportPDFStarted', func),
    exportPDFFinished: () => ipcRenderer.send('exportPDFFinished'),
    openFile: () => ipcRenderer.invoke('openFile')
})