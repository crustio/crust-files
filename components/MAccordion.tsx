import classNames from "classnames";
import React from "react";
import { Accordion, AccordionProps } from "semantic-ui-react";
import styled from "styled-components";
import { useToggle } from "../lib/hooks/useToggle";

export interface Props extends AccordionProps {
    title?: React.ReactNode,
    content?: React.ReactNode
    defActive?: boolean
}

function _MAccordion(props: Props) {
    const {
        className,
        title,
        defActive = false,
        content,
        ...otherProps } = props
    const [active, toggleActive] = useToggle(defActive)

    return <Accordion className={className} {...otherProps}>
        <Accordion.Title active={active} onClick={() => toggleActive()}>
            <div className="title font-sans-semibold">
                {title}<span className={classNames('icon', active ? 'cru-fo-chevron-up' : 'cru-fo-chevron-down')} />
            </div>
        </Accordion.Title>
        <Accordion.Content active={active}>
            {content}
        </Accordion.Content>
    </Accordion>
}

export const MAccordion = React.memo<Props>(styled(_MAccordion)`

`)