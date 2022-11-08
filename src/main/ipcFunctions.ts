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

        startImportCodeFileFolder() {
          this.mainWindow.webContents.send("onImportCodeFileFolder");
        }

        startImportCodeFile() {
			this.mainWindow.webContents.send("onImportCodeFile");
		  }

        refreshCodeFiles() {
          this.mainWindow.webContents.send("onRefreshCodeFiles");
        }

        //export pdf
        exportPDF(pathToPdf : string) {
                let pdfPath = pathToPdf;
                if(pathToPdf == "")
                        pdfPath = path.join(os.homedir(), 'Downloads', 'code_files.pdf')
                this.mainWindow?.webContents.printToPDF({printBackground: true, pageSize:"A4", footerTemplate:"<div><span style=\"font-size:10rem; margin-left:290px;\" class=\"pageNumber\"></span></div>", headerTemplate:" ",displayHeaderFooter:true}).then(data => {
                fs.writeFile(pdfPath, data, (error) => {
                if (error) throw error
                console.log(`Wrote PDF successfully to ${pdfPath}`)
                })
                }).catch(error => {
                console.log(`Failed to write PDF to ${pdfPath}: `, error)
                })
                this.mainWindow.webContents.send('exportPDFFinished')
        }

      //save file
      async saveFile() {
        const dialogOptions = {filters: [{ name: "PDF", extensions: ["pdf"] }]};
        const { canceled, filePath } = await dialog.showSaveDialog(this.mainWindow, dialogOptions);
        if (canceled) {
          return null;
        } else {
          return filePath;
        }
      }
}
