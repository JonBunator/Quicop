import CodeEditor from '../CodeEditor';
import MarkdownVisualization from '../MarkdownVisualization/MarkdownVisualization'
import './MarkdownEditor.scss'

export default function MarkdownEditor(props : any) {
        return (
        <div className='q-editor-panels'>
                <CodeEditor code={props.code} onChange={props.onCodeChange}/>
                <div className='q-markdown-panel'>
                        <MarkdownVisualization code={props.code} codeFiles={props.codeFiles} dark={true}/>
                </div>
        </div>)
}
