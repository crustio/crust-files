import React, { useCallback } from "react";
import { Grid, Menu, Segment, Sidebar } from 'semantic-ui-react'
import { useRouter } from "next/router";
import classNames from "classnames";
import styled from "styled-components";
import Logo from "./Logo";

type Path = '/files' | '/docs' | '/setting' | '/home' | '/files/vault' | '/share-earn' | '/user'

export interface Props {
  className?: string
  children: any,
  path: Path,
}

interface MenuInfo {
  path: Path,
  icon?: string,
  name: string,
  isParent?: boolean,
}

const menus: MenuInfo[] = [
  { path: "/home", icon: "cru-fo-home", name: 'Home' },
  { path: "/files", icon: "cru-fo-file", isParent: true, name: 'My File' },
  { path: "/files", name: 'Public' },
  { path: "/files/vault", name: 'Vault' },
  { path: "/setting", icon: "cru-fo-settings", name: 'Settings' },
  { path: "/docs", icon: "cru-fo-file-text", name: 'Docs' },
  { path: "/user", icon: "cru-fo-user", name: 'Premium User' },
]

function SideLayout(props: Props) {
  const r = useRouter()
  const _onTabClick = useCallback((_: any, { index }: { index: number }) => {
    const m = menus[index]
    if (m.path !== props.path)
      r.push(m.path)
  }, [props.path])

  const isActive = (info: MenuInfo) => props.path === info.path
  const isActive2 = (info: MenuInfo) => props.path.startsWith(info.path) && info.isParent

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
          <Logo src="/images/logo_12x.png" />
        </Grid.Row>
        <Grid.Row columns={1}>
          <Menu fluid vertical borderless>
            {
              menus.map((mInfo, index) => <Menu.Item
                className={isActive2(mInfo) ? 'active2' : ''}
                position={"left"}
                key={`side_menu_${index}`}
                index={index}
                active={isActive(mInfo)}
                icon={<span className={mInfo.icon ?? 'cru-fo-file'} style={{ opacity: mInfo.icon ? 1 : 0 }} />}
                name={mInfo.name}
                onClick={_onTabClick}
              />)
            }
          </Menu>
        </Grid.Row>
        <Grid.Row columns={1}>
            
        </Grid.Row>
      </Grid>
    </Sidebar>

    <Sidebar.Pusher>
      {props.children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
}

const sideWidth = '15.7rem'
export default React.memo<Props>(styled(SideLayout)`
  overflow: hidden;
  height: 100vh;
  background: white;

  .ui.sidebar {
    background: #F5F5F5;
    box-shadow: unset !important;
    width: ${sideWidth};

    .logoPanel {
      padding: 4.7rem 0;

      img {
        height: 1.7rem;
      }
    }

    .menu {
      box-shadow: unset !important;
      border: unset !important;
      border-radius: unset !important;
      background: unset !important;

      .item {
        border-radius: 0 !important;
        text-align: left;
        padding-left: 2rem !important;
        font-weight: 500;
        font-size: 1.3rem;
        color: var(--secend-color);
        font-family: OpenSans-Regular;

        &.active {
          position: relative;
          color: var(--main-color);
          font-family: OpenSans-Medium;
          border-right: solid 0.2rem var(--primary-color);
        }

        &.active2 {
          color: var(--main-color);
          border-right: unset;
          background-color: transparent;
        }

        span {
          float: left;
          margin-right: 10px;
        }
      }
    }
  }

  .pusher {
    width: calc(100vw - ${sideWidth});
    height: 100vh;
    transform: translate3d(${sideWidth}, 0, 0) !important;
    overflow: auto !important;
    background: white;
  }
`)
