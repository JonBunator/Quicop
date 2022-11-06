
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'

export default function MarkdownVisualization(props : any) {

        marked.setOptions({
                langPrefix: "hljs language-",
                highlight: function(code, lang) {
                        if (lang && hljs.getLanguage(lang)) {
                                try {
                                  return hljs.highlight(code, {language: lang}).value;
                                } catch (err) {}
                              }
                          
                              try {
                                return hljs.highlightAuto(code).value;
                              } catch (err) {}
                          
                              return '';
                }
        });

        function getCode(key : string) {
                console.log(props.rerender)
                const codeFiles = props.codeFiles;
                const notCached ="Code \"" + key + "\" is not chached. Click refresh!";
                if(codeFiles === undefined) {
                        return notCached;
                }

                if(props.codeFiles.has(key)) {
                        return props.codeFiles.get(key);
                }
                 return notCached
        }

        function parseSpecialMarkdown() {
                const regex = /!CodeFile\["(.*)"\]/g;
                let compiledCode = ""
                let code = props.code;
                let match;
                let start = 0;
                while ((match = regex.exec(props.code)) != null) {
                        let path : string = match[1];
                        compiledCode += marked.parse(code.substring(start, match.index))
                        compiledCode += marked.parse("```java\n" + getCode(path) + "\n```")
                        start = regex.lastIndex
               }
               compiledCode += marked.parse(code.substring(start))
               return compiledCode;
        }

        function createMarkup() {
                return {__html : parseSpecialMarkdown()}
        }

        return(
                <div className='markdown-generated' dangerouslySetInnerHTML={createMarkup()} />
        )
}
