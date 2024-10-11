import { useTranslation } from "react-i18next";

export function useT(...args: Parameters<typeof useTranslation>){
   const data =  useTranslation(...args)
   return {...data, t: data.t}
}