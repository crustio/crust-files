import React, { MouseEvent, useMemo, useState } from "react";
import { DropdownItemProps, DropdownProps, Popup } from "semantic-ui-react";
import styled from "styled-components";
import { useToggle } from "../lib/hooks/useToggle";
import useOnClickOutside from "../lib/hooks/useOnClickOut";
import _ from 'lodash';
import classNames from "classnames";

export interface Props extends DropdownProps {
  help?: string,
  label?: string,
  defaultGroup?: string,
  footer?: React.ReactNode
}

const NULL_GROUP = '_null'

type SelectData = {
  group: string,
  value: string | number | boolean | (number | string | boolean)[]
}

const RenderGroup = (
  { expand, list, group, select, onClickItem, onClickGroup, renderGroupTitle = null }:
    {
      expand: boolean,
      list: DropdownItemProps[],
      group: string,
      select: SelectData,
      onClickItem: (e: MouseEvent<HTMLDivElement>, s: SelectData) => void,
      onClickGroup: (e: MouseEvent<HTMLDivElement>) => void,
      renderGroupTitle: (d: { group: string, select: SelectData, onClickGroup: (e: MouseEvent<HTMLDivElement>) => void }) => any,
    }
) => {
  const groupActive = group === select.group
  return <div className={"group"}>
    {
      group !== NULL_GROUP &&
      (renderGroupTitle && renderGroupTitle({ group, select, onClickGroup }) ||
        <div className={classNames("title", { active: groupActive })} onClick={onClickGroup}>
          {group} <span className="dropIcon cru-fo-chevron-down" />
        </div>)
    }
    {
      expand &&
      list.map((item, index) =>
        <div className={classNames("item", { active: groupActive && item.value === select.value })}
          key={`group_item_${index}`}
          onClick={(e) => onClickItem(e, { group, value: item.value })}>{item.text}</div>)
    }
  </div>
}


function MDropdown(props: Props) {
  const { className, label, help, options, defaultValue, defaultGroup = NULL_GROUP, renderGroupTitle, footer } = props
  const [select, setSelect] = useState<SelectData>({ value: defaultValue, group: defaultGroup })
  const selectOption = useMemo(() => {
    return _.find(options, (item) => {
      const group = item.group || NULL_GROUP
      return group === select.group && item.value === select.value
    })
  }, [options, select])

  const [expandGroup, setExpandGroup] = useState(defaultGroup)
  const [visible, toggleVisible] = useToggle()
  const ref = useOnClickOutside(() => {
    if (visible) {
      toggleVisible(false)
    }
  })

  const groupOptions: {
    [key: string]: DropdownItemProps[]
  } = useMemo(() => {
    return _.groupBy(options, (item) => item.group || NULL_GROUP)
  }, [options])

  const groups: string[] = _.keys(groupOptions)

  return <div className={classNames(className, 'mdropdown')} onClick={() => toggleVisible()} ref={ref}>
    {
      label && <div className="label font-sans-semibold">
        {label}
        {
          help && <Popup
            position={"top center"}
            trigger={<span className="icon cru-fo-help-circle" />}
            content={help} />
        }

      </div>
    }
    <span className={classNames("dropIcon", "cru-fo-chevron-down")} />
    <div className="text font-sans-regular">{selectOption?.text ?? ''}</div>
    {
      visible && <div className={"options"}>
        {groups.map((group, index) =>
          <RenderGroup
            key={`group_${index}`}
            group={group}
            renderGroupTitle={renderGroupTitle}
            select={select}
            expand={expandGroup === group || group === NULL_GROUP}
            list={groupOptions[group]}
            onClickGroup={(e) => {
              setExpandGroup(expandGroup === group ? NULL_GROUP : group)
              e.stopPropagation()
            }}
            onClickItem={(e, data) => {
              setSelect(data)
              props.onChange(e, data)
            }} />)}
        {footer}
      </div>
    }
  </div>


}

export default React.memo<Props>(styled(MDropdown)`
  &.mdropdown {
    position: relative;
    width: 100%;
    border-radius: 0.57rem;
    border: 1px solid var(--line-color);
    padding: 0.8rem 1rem;
    cursor: pointer;

    .label {
      font-size: 1rem;
      font-weight: 600;
      white-space: nowrap;
      color: var(--main-color);
      margin-bottom: 0.6rem;

      .icon {
        font-size: 1.3rem;
        position: relative;
        top: 0.2rem;
        margin-left: 0.86rem;
        cursor: pointer;
        color: var(--secend-color);
      }
    }

    .dropIcon {
      float: right;
      position: relative;
      top: -0.9rem;
      right: 0;
    }

    .text {
      font-size: 1rem;
      color: #999999;
    }

    .options {
      width: 100%;
      background: white;
      position: absolute;
      top: calc(100% + 1px);
      left: 0;
      z-index: 10;
      border-radius: 4px;
      border: 1px solid var(--line-color);
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);

      .group {

        .title {
          cursor: pointer;
          border-top: 1px solid var(--line-color);
          padding: 0.8rem 1rem;
          font-size: 1.2rem;
          font-weight: 500;

          &:hover, &.active {
            background: var(--line-color);
          }

          .dropIcon {
            float: right;
            right: 0.6rem;
            top: 0rem;
          }
        }

        .item {
          padding: 0.6rem 1.6rem;
          cursor: pointer;

          &:hover, &.active {
            background: var(--line-color);
          }
        }
      }
    }
  }
`)
