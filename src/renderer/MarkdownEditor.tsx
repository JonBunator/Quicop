import React, {useState } from 'react';
import { ViewUpdate } from '@codemirror/view';
import CodeEditor from './CodeEditor';
import MarkdownVisualization from './MarkdownVisualization'

export default function MarkdownEditor(props : any) {
        return (
        <div className='editor-panels'>
                <CodeEditor id="code-editor" code={props.code} onChange={props.onCodeChange}/>
                <MarkdownVisualization code={props.code} codeFiles={props.codeFiles}/>
        </div>)
}
