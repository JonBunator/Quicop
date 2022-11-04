import MarkdownVisualization from './MarkdownVisualization'
import { useEffect } from "react";

export default function PdfExportView(props : any) {
        useEffect(() => {
                window.electron.ipcRenderer.sendMessage('print-to-pdf', []);
        }, []);

        return (<MarkdownVisualization code={props.code}/>
        )
}
