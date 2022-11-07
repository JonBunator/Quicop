import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import {githubDark} from "@uiw/codemirror-theme-github"

export default function CodeEditor(props : any) {
        return (
                <CodeMirror
                className='q-code-editor'
                extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
                height="100%"
                value={props.code}
                theme={githubDark}
                onChange={props.onChange} />)
}