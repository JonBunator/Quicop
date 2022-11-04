import React, {useState } from 'react';
import MarkdownEditor from './MarkdownEditor';
import PdfExportView from './PdfExportView';
import { useEffect } from "react";

export default function RootComponent() {
        const [code, setCode] = useState("")
        const [defaultView, setDefaultView] = useState(true)
        const [path, setPath] = useState("")

        const onCodeChange = React.useCallback((value : any, viewUpdate : any) => {
          setCode(value)
          console.log(value)
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
            <MarkdownEditor code={code} onCodeChange={onCodeChange}/>
          )}
          {!defaultView && (
            <PdfExportView code={code} path={path} />
          )}
        </>)
}
