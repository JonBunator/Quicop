import React, {useState } from 'react';
import MarkdownEditor from './MarkdownEditor';
import PdfExportView from './PdfExportView';
import { useEffect } from "react";

export default function RootComponent(props : any) {
        const [code, setCode] = useState("")
        const [defaultView, setDefaultView] = useState(true)
      
        const onCodeChange = React.useCallback((value : any, viewUpdate : any) => {
          setCode(value)
          console.log(value)
      }, []);
      const onTriggerPdfExport = React.useCallback((args : any) => {
        setDefaultView(false)
    }, []);
      
    useEffect(() => {
      window.electronAPI.onExportPDFFinished(function() {
        setDefaultView(true)
      })
    }, []);

        return (
          <>
          {defaultView && (
            <MarkdownEditor code={code} onCodeChange={onCodeChange} onTriggerPdfExport={onTriggerPdfExport}/>
          )}
          {!defaultView && (
            <PdfExportView code={code} />
          )}
        </>)
}
