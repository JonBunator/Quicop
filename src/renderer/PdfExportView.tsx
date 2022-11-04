import MarkdownVisualization from './MarkdownVisualization'
import { useEffect } from "react";

export default function PdfExportView(props : any) {
        useEffect(() => {
                console.log("hello")
                window.electronAPI.exportPDF();
        }, []);

        return (<MarkdownVisualization code={props.code}/>
        )
}
