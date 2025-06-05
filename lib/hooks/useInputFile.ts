import { Dispatch, MutableRefObject, SetStateAction, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../AppContext";
import { DirFile, FileInfo } from "../wallet/types";
import _ from "lodash";

export interface WrapInputFile {
    file?: FileInfo,
    setFile: Dispatch<SetStateAction<FileInfo | undefined>>
    inputRef?: MutableRefObject<HTMLInputElement>,
    _onInputFile: FunInputFile,
    _onClickUpFile: () => void,
    _onClickUpFolder: () => void,
}

type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void

export default function useInputFile(): WrapInputFile {
    const { t } = useTranslation()
    const { alert } = useContext(AppContext)

    const [file, setFile] = useState<FileInfo | undefined>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);
    const _clickUploadFile = useCallback((dir = false) => {
        if (!inputRef.current) return;
        // eslint-disable-next-line
        // @ts-ignore
        // eslint-disable-next-line
        inputRef.current.webkitdirectory = dir;
        // eslint-disable-next-line
        inputRef.current.multiple = dir;
        inputRef.current.click();
    }, [inputRef]);
    const _onClickUpFile = useCallback(() => _clickUploadFile(false), [_clickUploadFile]);
    const _onClickUpFolder = useCallback(() => _clickUploadFile(true), [_clickUploadFile]);
    const _onInputFile = useCallback<FunInputFile>((e) => {
        try {
            console.info('onInputFile:', e.target.files)
            const files = _.filter(e.target.files||[]);
            const size = _.size(files)
            if (!files || size == 0) return;
            if (size > 2000) {
                alert.alert({
                    title: t('Upload'),
                    msg: t('Please do not upload more than 2000 files'),
                    type: 'error'
                })
                return;
            }
    
            if (size === 0) {
                alert.alert({
                    title: t('Upload'),
                    msg: t('Please select non-empty folder'),
                    type: 'error'
                })
                return;
            }
    
            // eslint-disable-next-line
            // @ts-ignore
            // eslint-disable-next-line
            const isDirectory = e.target.webkitdirectory;
    
            if (!isDirectory) {
                setFile({ file: files[0] });
            } else if (files.length >= 1) {
                const dirFiles: DirFile[] = [];
                for (let index = 0; index < files.length; index++) {
                    // console.info('f:', files[index]);
                    dirFiles.push(files[index] as DirFile);
                }
                console.info(dirFiles);
                const [dir] = (dirFiles[0].webkitRelativePath || '').split('/');
                if(!dir && size == 1){
                    setFile({ file: files[0] });             
                } else {
                    setFile({ files: dirFiles, dir: dir || 'Files' });
                }
            }
            e.target.value = '';
        } catch (error) {
            alert.alert({
                title: t('Upload'),
                msg: 'Select file error ' + JSON.stringify(error),
                type: 'error'
            })
        }
    }, [setFile, alert, t]);
    return useMemo(() => ({
        file,
        setFile,
        inputRef,
        _onClickUpFile,
        _onClickUpFolder,
        _onInputFile,
    }), [file, inputRef, _onClickUpFile, _onClickUpFolder, _onInputFile])
}