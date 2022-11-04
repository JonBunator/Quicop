
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

        function createMarkdown() {
                return {__html : marked.parse(props.code)}
        }

        return(
                <div className='markdown-generated' dangerouslySetInnerHTML={createMarkdown()} />
        )
}
