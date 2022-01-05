import classNames from "classnames";
import React, { DragEvent, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useToggle } from "../lib/hooks/useToggle";
import { DirFile, FileInfo } from "../lib/types";
import { BaseProps } from "./types";

export interface Props extends BaseProps {
    onDrop?: (info: FileInfo) => void,
}

function readFile(entry: any, path: string): Promise<File> {
    return new Promise((resolve) => {
        entry.file(file => {
            file._webkitRelativePath = `${path}/${file.name}`
            resolve(file)
        })
    })
}

function readEntries(reader: any, path: string): Promise<File[]> {
    return new Promise((resolve) => {
        let data: File[] = []
        reader.readEntries(async (entries: any[]) => {
            const length = entries.length
            if (length) {
                for (const itemEntry of entries) {
                    if (itemEntry.isFile) {
                        data.push(await readFile(itemEntry, path))
                    } else if (itemEntry.isDirectory) {
                        data = data.concat(await readEntries(itemEntry.createReader(), `${path}/${itemEntry.name}`))
                    }
                }
                data = data.concat(await readEntries(reader, path))
            }
            resolve(data)
        })
    })
}

async function getFileInfo(data: DataTransfer): Promise<FileInfo | null> {
    if (!data.files.length) return null
    const files = data.items
    const info: FileInfo = { files: [] }
    const isOne = files.length === 1;
    const readers: { reader: any, path: string }[] = []
    for (let i = 0; i < files.length; i++) {
        const f = files[i]
        const entry = f.webkitGetAsEntry()
        if (entry && entry.isDirectory) {
            if (isOne) { info.dir = entry.name }
            readers.push({ reader: entry.createReader(), path: entry.name })
        } else if (entry) {
            if (isOne) {
                info.file = f.getAsFile()
            } else {
                info.files.push(f.getAsFile() as DirFile)
            }
        }
    }
    for (const read of readers) {
        const entries = await readEntries(read.reader, read.path)
        info.files = info.files.concat(entries as DirFile[])
    }
    return info
}

function _OnDrapDropFrame(p: Props) {
    const {
        className,
    } = p;

    const [show, toggle] = useToggle()
    const [rootNext, setRootNext] = useState<HTMLElement>(null)
    const onDrop = async (e: DragEvent) => {
        e.preventDefault()
        const info = await getFileInfo(e.dataTransfer)
        console.info('fielInfo:', info)
        toggle(false)
        if(info && p.onDrop) p.onDrop(info)
    }
    useEffect(() => {
        const rootNext = document.getElementById('__next')
        setRootNext(rootNext)
    }, [])
    useEffect(() => {
        if (!rootNext) return
        const onDragEnter = (e: any) => {
            e.preventDefault()
            toggle(true)
        }
        const onDragLeave = (e) => {
            if (e.target.id === '_drap_drop_frame') {
                toggle(false)
            }
        }
        rootNext.addEventListener('dragenter', onDragEnter)
        rootNext.addEventListener('dragleave', onDragLeave)
        return () => {
            const el = document.getElementById('_drap_drop_frame')
            if (el) {
                rootNext.removeChild(el)
            }
            rootNext.removeEventListener('dragenter', onDragEnter)
            rootNext.removeEventListener('dragleave', onDragLeave)
            // if (dropFrame)
            //     dropFrame.removeEventListener('drop', onDrop)
        }
    }, [rootNext])
    if (!rootNext) return null
    return ReactDOM.createPortal(
        <div id="_drap_drop_frame" onDrop={onDrop} onDragOver={(e) => e.preventDefault()} className={classNames(className, { show })}>
            Upload files to this directory
        </div>,
        rootNext
    )
}

export const OnDrapDropFrame = React.memo<Props>(styled(_OnDrapDropFrame)`
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 9999999;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.7);
    border: 3px dashed #CCCCCC;
    box-sizing: border-box;
    display: none;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 36px;
    &.show {
        display: flex;
    }
`)