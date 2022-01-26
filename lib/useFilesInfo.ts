import { useMemo } from "react";
import { WrapFiles } from "./wallet/hooks";
import _ from 'lodash';
import fileSize from "filesize";
import { SaveFile } from "./types";

export interface FilesInfo {
    count: number,
    publicCount: number,
    valutCount: number,
    publicSize: string,
    valutSize: string,
}
export function useFilesInfo(wFiles: WrapFiles): FilesInfo {
    return useMemo(() => {
        const count = wFiles.files.length
        const groupFiles: { [k: string]: SaveFile[] } = _.groupBy(wFiles.files, item => item.Encrypted ? 'valut' : 'public')
        if (!groupFiles.public) groupFiles.public = []
        if (!groupFiles.valut) groupFiles.valut = []
        const publicCount = _.size(groupFiles.public)
        const valutCount = _.size(groupFiles.valut)
        const publicSize = fileSize(_.sumBy(groupFiles.public, f => _.toNumber(f.Size))).toUpperCase()
        const valutSize = fileSize(_.sumBy(groupFiles.valut, f => _.toNumber(f.Size))).toUpperCase()
        return {
            count,
            publicCount,
            valutCount,
            publicSize,
            valutSize
        }
    }, [wFiles.files])
}