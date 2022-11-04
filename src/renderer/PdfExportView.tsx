import MarkdownVisualization from './MarkdownVisualization'
import { useEffect } from "react";

export default function PdfExportView(props : any) {
        useEffect(() => {
                window.electronAPI.exportPDF(props.path);
        }, []);

        return (<MarkdownVisualization code={props.code}/>
        )
}
