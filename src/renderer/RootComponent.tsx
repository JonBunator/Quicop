import React, {useState } from 'react';
import MarkdownEditor from './MarkdownEditor';
import PdfExportView from './PdfExportView';
import { useEffect } from "react";

export default function RootComponent(props : any) {
  const [code, setCode] = useState("")
        const [defaultView, setDefaultView] = useState(true)
        const [path, setPath] = useState("")
        const [codeFiles, setCodeFiles] = useState(new Map<string, string>);

        const onCodeChange = React.useCallback((value : any, viewUpdate : any) => {
          setCode(value)
        }, []);

      //create code files content
      function createCodeFilesContent(code : string) {
        const regex = /!CodeFile\["(.*)"\]/g;
        let match : any;
        while ((match = regex.exec(code)) != null) {
          let codePath : string = match[1];
          const fileContent = window.electronAPI.loadFile(codePath);
          fileContent.then(content => {
            if(content == null) {
              if(!codeFiles.has(codePath)) {
                setCodeFiles(prev => new Map(prev.set(codePath, "Code with path \"" + codePath + "\" has not been found!")));
              }
            } else if(!codeFiles.has(codePath)) {
              setCodeFiles(prev => new Map(prev.set(codePath, content)));
            }
          })
        }
      }

    useEffect(() => {
      window.electronAPI.onImportCodeFileFolder(() => {
        const filePaths = window.electronAPI.openFolder();
        filePaths.then((directory) => {
          if(directory != null) {
            window.electronAPI.readFilePaths(directory).then(files => {
              let codeToAppend = "";
              files.forEach((path) => {
                if(code != "") {
                  codeToAppend += "\n";
                }
                codeToAppend += "!CodeFile[\"" + path + "\"]\n";
              })
              setCode(prev => prev + codeToAppend);
              createCodeFilesContent(code + codeToAppend)
            })
          }
        })
      })
    }, []);

    useEffect(() => {
      window.electronAPI.onImportCodeFile(() => {
        const filePath = window.electronAPI.openFile();
        filePath.then((file) => {
          if(file != null) {
            let codeToAppend = "";
            if(code != "") {
              codeToAppend += "";
            }
            codeToAppend = "!CodeFile[\"" + file + "\"]\n";
            setCode(prev => prev + codeToAppend);
            createCodeFilesContent(code + codeToAppend)
          }
        })
      })
    }, []);

    useEffect(() => {
      //pdf export with path started
      window.electronAPI.onExportPDFPathStarted(() => {
        const filePath = window.electronAPI.saveFile();
        filePath.then((result) => {
          setPath(result);
          setDefaultView(false)
        })
      })
    }, []);

    useEffect(() => {
      //pdf export without path started
      window.electronAPI.onExportPDFStarted(function() {
        setPath("");
        setDefaultView(false)
      })
    }, []);

    useEffect(() => {
      //pdf export finished
      window.electronAPI.onExportPDFFinished(function() {
        setPath("");
        setDefaultView(true)
      })
    }, []);



        return (
          <>
          {defaultView && (
            <>
            <MarkdownEditor code={code} onCodeChange={onCodeChange} codeFiles={codeFiles}/>
            <button onClick={() => createCodeFilesContent(code)}>Refresh</button>
            </>
          )}
          {!defaultView && (
            <PdfExportView code={code} path={path} codeFiles={codeFiles}/>
          )}
        </>)
}
