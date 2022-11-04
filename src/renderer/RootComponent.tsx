import React, {useState } from 'react';
import MarkdownEditor from './MarkdownEditor';
import PdfExportView from './PdfExportView';
import { useEffect } from "react";

export default function RootComponent() {
        const [code, setCode] = useState("")
        const [defaultView, setDefaultView] = useState(true)
        const [path, setPath] = useState("")
        const [codeFiles, setCodeFiles] = useState(new Map<string, string>);

        const onCodeChange = React.useCallback((value : any, viewUpdate : any) => {
          setCode(value)
      }, []);
      

      const addCodeFile = (key : string, value : string) =>{
        setCodeFiles(previousState => new Map(previousState.set(key, value)))
      }

      //create code files content
      async function createCodeFilesContent() {
              const regex = /!CodeFile\["(.*)"\]/g;
              let match : any;
              while ((match = regex.exec(code)) != null) {
                      let codePath : string = match[1];
                      const fileContent = await window.electronAPI.loadFile(codePath);
                      if(fileContent == null) {
                              if(!codeFiles.has(codePath)) {
                                      addCodeFile(codePath, "Code with path \"" + codePath + "\" has not been found!");
                              }
                      } else {
                              if(!codeFiles.has(codePath)) {
                                      addCodeFile(codePath, fileContent);
                              }
                      }                             
              }
              console.log(codeFiles)
        }


    useEffect(() => {
      createCodeFilesContent();

      //pdf export with path started
      window.electronAPI.onExportPDFPathStarted(() => {
        const filePath = window.electronAPI.saveFile();
        filePath.then((result) => {
          setPath(result);
          setDefaultView(false)
        })
      })
      //pdf export without path started
      window.electronAPI.onExportPDFStarted(function() {
        setPath("");
        setDefaultView(false)
      })
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
            <button onClick={createCodeFilesContent}>Refrest</button>
            </>
          )}
          {!defaultView && (
            <PdfExportView code={code} path={path} codeFiles={codeFiles}/>
          )}
        </>)
}
