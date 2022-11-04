import {BrowserWindow, dialog} from 'electron';
import path from 'path';
import fs  from 'fs'
import os from 'os'

export default class IpcFunctions {
        mainWindow: BrowserWindow;
      
        constructor(mainWindow: BrowserWindow) {
          this.mainWindow = mainWindow;
        }

        startExportPDF() {
                this.mainWindow.webContents.send("exportPDFStarted");
        }

        startExportPDFPath() {
                this.mainWindow.webContents.send("exportPDFPathStarted");
        }

        //export pdf
        exportPDF(pathToPdf : string) {
                let pdfPath = pathToPdf;
                if(pathToPdf == "")
                        pdfPath = path.join(os.homedir(), 'Downloads', 'code_files.pdf')
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
      
      //saveFile
      async saveFile() {
        const dialogOptions = {filters: [{ name: "PDF", extensions: ["pdf"] }]};
        const { canceled, filePath } = await dialog.showSaveDialog(this.mainWindow, dialogOptions);
        console.log(canceled)
        if (canceled) {
          return ""
        } else {
          return filePath
        }
      }
}