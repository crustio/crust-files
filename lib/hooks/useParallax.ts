import {useEffect, useMemo, useState} from "react";

export class ParallaxItem {
  value = false
}

export interface UseParallax {
  data: ParallaxItem[]
}

export default function useParallax(parallax: number, count: number): UseParallax {
  const initList = useMemo(() => {
    const list: ParallaxItem[] = []
    for (let i = 0; i < count; i++) list.push(new ParallaxItem())
    return list
  }, [count])

  const [data, setData] = useState(initList)

  useEffect(() => {
    let index = count + 1
    setData(initList)
    const task = setInterval(() => {
      if (index >= initList.length) {
        index -= 1;
        return;
      }
      if (index < 0) {
        clearInterval(task)
        return;
      }
      console.info('setValueTrue-->', index)
      setData((oldList) => {
        oldList[index].value = true
        return [...oldList]
      })
      index -= 1
    }, parallax)
    return () => clearInterval(task)
  }, [initList, parallax, count])

  return useMemo(() => ({data}), [data])
}
