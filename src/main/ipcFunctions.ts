import {BrowserWindow, dialog} from 'electron';
import path from 'path';
import fs  from 'fs'
import os from 'os'
import { contextIsolated } from 'process';

export default class IpcFunctions {
        mainWindow: BrowserWindow;
      
        constructor(mainWindow: BrowserWindow) {
          this.mainWindow = mainWindow;
        }

        startExportPDF() {
                this.mainWindow.webContents.send("exportPDFStarted");
        }

        //export pdf
        exportPDF() {
                const pdfPath = path.join(os.homedir(), 'Downloads', 'code_files.pdf')
                this.mainWindow?.webContents.printToPDF({marginsType: 1, printBackground: true}).then(data => {
                fs.writeFile(pdfPath, data, (error) => {
                if (error) throw error
                console.log(`Wrote PDF successfully to ${pdfPath}`)
                })
                }).catch(error => {
                console.log(`Failed to write PDF to ${pdfPath}: `, error)
                })
                this.mainWindow.webContents.send('exportPDFFinished')
        }
      
      //openfile
      async openFile() {
        const { canceled, filePaths } = await dialog.showOpenDialog(this.mainWindow!, {});
        if (canceled) {
          return
        } else {
          return filePaths[0]
        }
      }
}