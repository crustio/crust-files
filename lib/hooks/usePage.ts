import {Dispatch, SetStateAction, useMemo, useState} from "react";
import _ from 'lodash'


export interface UsePage<T> {
  totalPage: number,
  pageList: T[],
  setPage: Dispatch<SetStateAction<number>>,
  page: number
}

export function usePage<T>(list: T[], pageCount = 5): UsePage<T> {
  const [page, setPage] = useState(1)
  return useMemo<UsePage<T>>(() => {
    const chunkFiles: T[][] = _.chunk(list, pageCount)
    return {
      totalPage: chunkFiles.length,
      pageList: chunkFiles[page - 1] || [],
      setPage,
      page
    }
  }, [list, page])
}
