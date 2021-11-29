import { ReactNode } from "react";

export interface BaseProps {
    className?: string
}

export interface BasePropsWithChildren extends BaseProps {
    children: ReactNode
}