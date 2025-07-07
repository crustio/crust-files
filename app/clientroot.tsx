'use client'

import MApp from "@/components/root/MApp";
import { docsMenus } from "@/components/root/menus";
import { usePathname } from "@/lib/usePathname";
import React, { Fragment } from "react";

const MdPages = ["/privacy-policy", "/terms-of-service", ...docsMenus
    .map(item => item.path)]
export function ClientRoot({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    console.info('clientRoot:pathname:', pathname)
    if (MdPages.includes(pathname)) return <Fragment>{children}</Fragment>
    return <MApp>{children}</MApp>
}