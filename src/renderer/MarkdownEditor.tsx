import React, {useState } from 'react';
import { ViewUpdate } from '@codemirror/view';
import CodeEditor from './CodeEditor';
import MarkdownVisualization from './MarkdownVisualization'

export default function MarkdownEditor(props : any) {
        const [code, setCode] = useState(props.code)

        const onCodeChange = React.useCallback((value : string, viewUpdate : ViewUpdate) => {
                setCode(value)
                props.onCodeChange(value, viewUpdate)
        }, []);

        return (
        <div className='editor-panels'>
                <CodeEditor id="code-editor" code={code} onChange={onCodeChange}/>
                <MarkdownVisualization code={code} codeFiles={props.codeFiles}/>
        </div>)
}
