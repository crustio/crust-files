import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Grid, Segment, Sidebar } from 'semantic-ui-react';
import styled from "styled-components";
import { useSessionState } from "../lib/hooks/useSessionState";
import { PixelBtn } from "./effect/Pixels";
import Logo from "./Logo";

type Path = '/files' | '/setting' | '/home' | '/files/vault' | '/share-earn' | '/user'

export interface Props {
  className?: string
  children: any,
  path: Path,
}

interface MenuInfo {
  path?: Path,
  icon?: string,
  name: string,
  link?: string,
}

interface GroupMenuInfo extends MenuInfo {
  items: MenuInfo[],
  expand: boolean
}

type MenuItem = GroupMenuInfo | MenuInfo

const menus: MenuItem[] = [
  { path: "/home", icon: "cru-fo-home", name: 'Home' },
  {
    icon: "cru-fo-file", name: 'My Files', expand: true, items: [
      { path: "/files", name: 'Public' },
      { path: "/files/vault", name: 'Vault' }
    ]
  },
  { path: "/setting", icon: "cru-fo-settings", name: 'Settings' },
  // { path: "/share-earn", icon: "cru-fo-share-2", name: 'Share-and-Earn' },
  { path: "/user", icon: "cru-fo-user", name: 'Premium User' },
  // { icon: "cru-fo-credit-card", name: 'Pay to Download',link: 'https://p2d.crustapps.net/' },
  { icon: "cru-fo-database", name: 'Get CRU', link: 'https://swap.crustapps.net' },
]

interface GroupMenuProps {
  info: MenuItem,
  pagePath: Path,
  onClickItem: (m: MenuItem) => void
}

function GroupMenu(props: GroupMenuProps) {
  const { info: mInfo, pagePath, onClickItem } = props
  const { items, expand } = mInfo as GroupMenuInfo
  const isActive = (info: MenuInfo) => pagePath === info.path

  return <div className="group_menu_wrap">
    <PixelBtn
      className={classNames("btn_item", { active: isActive(mInfo) })}
      onClick={() => onClickItem(mInfo)}
      fillColor={isActive(mInfo) ? "#FF8D00" : "#000000"}
      color={isActive(mInfo) ? "#E46A11" : "#000000"}
      height={40}
      content={
        <>
          <span className={mInfo.icon ?? 'cru-fo-file'} style={{ opacity: mInfo.icon ? 1 : 0 }} />
          {mInfo.name}
          {items && <span className={classNames("group_menu_arrow", expand ? 'cru-fo-chevron-down' : 'cru-fo-chevron-right')} />}
        </>
      } />
    {
      expand && items.map((mInfo, index) =>
        <PixelBtn
          key={`side_menu_c_${index}`}
          className={classNames("btn_item", { active: isActive(mInfo) })}
          onClick={() => onClickItem(mInfo)}
          fillColor={isActive(mInfo) ? "#FF8D00" : "#000000"}
          color={isActive(mInfo) ? "#E46A11" : "#000000"}
          height={40}
          content={
            <>
              <span className={mInfo.icon ?? 'cru-fo-file'} style={{ opacity: mInfo.icon ? 1 : 0 }} />
              {mInfo.name}
            </>
          } />)
    }
  </div>
}

function SideLayout(props: Props) {
  const r = useRouter()
  const [expand, setExpand] = useSessionState(menus.map(item => !!(item as GroupMenuInfo).expand), 'side_menus_expand')
  const data = useMemo(() => {
    return menus.map((item, index) => ({ ...item, expand: expand[index] }))
  }, [expand])

  const _onTabClick = (m: MenuItem) => {
    if (m.path && m.path !== props.path)
      r.push(m.path)
    if (m.link)
      window.open(m.link, '_blank')
    if ((m as GroupMenuInfo).items) {
      setExpand((old) => {
        const fIndex = data.findIndex((item) => item === m)
        return old.map((item, index) => index === fIndex ? !item : item)
      })
    }
  }
  return <Sidebar.Pushable
    as={Segment}
    className={classNames(props.className, 'basic')}>
    <Sidebar
      as={Segment}
      animation={"push"}
      direction={"left"}
      visible={true}
      className="basic"
    >
      <Grid textAlign='center'>
        <Grid.Row columns={1} className={"logoPanel"}>
          <Logo src="/images/logo_22x.png" />
        </Grid.Row>
        <Grid.Row columns={1}>
          <div className="menus">
            {
              data.map((info, index) =>
                <GroupMenu
                  key={`group_menu_${index}`}
                  info={info}
                  pagePath={props.path}
                  onClickItem={_onTabClick}
                />
              )
            }
          </div>
        </Grid.Row>
      </Grid>
      <div className="flex1" />
      {/* <img className="share_earn" onClick={() => _onTabClick({}, { index: shareEarnIndex })} src="/images/share_earn.png" /> */}
    </Sidebar>

    <Sidebar.Pusher>
      {props.children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
}

const sideWidth = '240px'
export default React.memo<Props>(styled(SideLayout)`
  height: 100vh;
  background: white;
  overflow-y: auto;
  min-height: calc(448px + 13rem);
  margin: unset !important;

  .ui.sidebar {
    padding: unset !important;
    background: black;
    box-shadow: unset !important;
    width: ${sideWidth};
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .ui.grid {
      margin: unset !important;
      width: 100%;
    }
    .logoPanel {
      padding: 4.7rem 0;

      img {
        height: 24px;
      }
    }
    .menus {
      padding: 0 7px;
      width: 100%;
      .btn_item {
        border-radius: 0 !important;
        margin-top: 1.07rem;
        text-align: left;
        min-width: unset;
        width: 100%;
        /* padding-left: 2rem !important; */

        font-family: OpenSans-Regular;


        .btn_content {
          min-width: 0;
          flex: 1;
          font-weight: 500;
          font-size: 18px;
          text-align: left;
          color: var(--secend-color);
          white-space: nowrap;
          padding: 0 6px;
          span {
            position: relative;
            top: 1px;
            margin-right: 8px;
          }
        }
        &.active {
          .btn_content {
            position: relative;
            color: white;
            border-right: solid 0.2rem var(--primary-color);
          }
        }

        &.active2 {
          color: white;
          border-right: unset;
          background-color: transparent;
        }
        .group_menu_arrow {
          float: right;
          font-size: 22px;
          top: 9px !important;
        }
      }
    }
    .share_earn {
      cursor: pointer;
      width: 15rem;
      height: auto;
      margin-bottom: 1rem;
    }
  }

  .pusher {
    width: calc(100vw - ${sideWidth});
    height: 100%;
    transform: translate3d(${sideWidth}, 0, 0) !important;
    overflow: auto !important;
    background: white;
  }
`)
