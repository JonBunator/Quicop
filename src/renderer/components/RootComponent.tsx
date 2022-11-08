import React, {useState } from 'react';
import MarkdownEditor from './MarkdownEditor/MarkdownEditor';
import PdfExportView from './PdfExportView';
import { useEffect } from "react";
import FileStatus from './FileStatus'

export default function RootComponent(props : any) {
  const [code, setCode] = useState("")
        const [defaultView, setDefaultView] = useState(true)
        const [path, setPath] = useState("")
        const [codeFiles, setCodeFiles] = useState(new Map<string, [string, FileStatus]>);

        const onCodeChange = React.useCallback((value : any, viewUpdate : any) => {
          setCode(value)
        }, []);

      //create code files content
      function createCodeFilesContent(code : string) {
        const regex = /!CodeFile\["(.*)"\]/g;
        let match : any;
        while ((match = regex.exec(code)) != null) {
          let codePath : string = match[1];
          const file = window.electronAPI.loadFile(codePath);
          file.then(result => {
            if(result == null) {
              if(!codeFiles.has(codePath)) {
                setCodeFiles(prev => new Map(prev.set(codePath, ["", FileStatus.PathNotFoundError])));
              }
			} else if(result[1] && !codeFiles.has(codePath)) {
				setCodeFiles(prev => new Map(prev.set(codePath, ["", FileStatus.BinaryFileError])));


            } else if(!codeFiles.has(codePath)) {
              setCodeFiles(prev => new Map(prev.set(codePath, [result[0], FileStatus.Success])));
            }
          })
        }
      }

    useEffect(() => {
      window.electronAPI.onImportCodeFileFolder(async () => {
        const directory = await window.electronAPI.openFolder();
        if(directory != null) {
			let codeToAppend = "";
            const files = await window.electronAPI.readFilePaths(directory);
            files.forEach((path, index) => {
                if(index == 0 && code.length != 0) {
                	codeToAppend += "\n";
                }
                codeToAppend += "!CodeFile[\"" + path + "\"]\n";
            })
			createCodeFilesContent(code + codeToAppend)
			setCode(prev => prev + codeToAppend);
        }
      })
	  return () => {
		window.electronAPI.removeAllImportCodeFileFolderListeners();
		};
    }, [code]);

    useEffect(() => {
      	window.electronAPI.onImportCodeFile(async () => {
			const file = await window.electronAPI.openFile();
			let codeToAppend = "";
			if(file != null) {
				if(code.length != 0) {
					codeToAppend += "\n";
				}
				codeToAppend = "!CodeFile[\"" + file + "\"]\n";
				createCodeFilesContent(code + codeToAppend);
				setCode(prev => prev + codeToAppend);
			}
    	})
	  	return () => {
			window.electronAPI.removeAllImportCodeFileListeners();
		};
    }, [code]);

	//refresh code files
	useEffect(() => {
		window.electronAPI.onRefreshCodeFiles(() => {
				createCodeFilesContent(code);
		});
		return () => {
			window.electronAPI.removeAllRefreshCodeFilesListeners();
		};
	}, [code]);

    useEffect(() => {
      //pdf export with path started
      window.electronAPI.onExportPDFPathStarted(() => {
        const filePath = window.electronAPI.saveFile();
        filePath.then((result) => {
          setPath(result);
          setDefaultView(false)
        })
      })
    }, []);

    useEffect(() => {
      //pdf export without path started
      window.electronAPI.onExportPDFStarted(function() {
        setPath("");
        setDefaultView(false)
      })
    }, []);

    useEffect(() => {
      //pdf export finished
      window.electronAPI.onExportPDFFinished(function() {
        setPath("");
        setDefaultView(true)
      })
    }, []);



        return (
          <>
          {defaultView && (
            <MarkdownEditor code={code} onCodeChange={onCodeChange} codeFiles={codeFiles}/>
          )}
          {!defaultView && (
            <PdfExportView code={code} path={path} codeFiles={codeFiles}/>
          )}
        </>)
}
