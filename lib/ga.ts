import { useRouter } from "next/router"
import { useEffect } from "react"
import { GA_ID } from "./config"

export const pageview = (path: string) => {
    (window as any).gtag('config', GA_ID, {
        page_path: path,
    })
}

// log specific events happening.
export const event = ({ action, params }) => {
    (window as any).gtag('event', action, params)
}

export const useGaPageView = () => {
    const r = useRouter()
    useEffect(() => {
        const handleChange = (path) => { pageview(path) }
        r.events.on('routeChangeComplete', handleChange)
        return () => r.events.off('routeChangeComplete', handleChange)
    }, [r.events])
}