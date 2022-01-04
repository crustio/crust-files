import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Grid, Segment, Sidebar } from 'semantic-ui-react';
import styled from "styled-components";
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
  isParent?: boolean,
  link?: string,
}

const menus: MenuInfo[] = [
  { path: "/home", icon: "cru-fo-home", name: 'Home' },
  { icon: "cru-fo-file", isParent: true, name: 'My Files' },
  { path: "/files", name: 'Public' },
  { path: "/files/vault", name: 'Vault' },
  { path: "/setting", icon: "cru-fo-settings", name: 'Settings' },
  // { path: "/docs", icon: "cru-fo-file-text", name: 'Docs' },
  { path: "/share-earn", icon: "cru-fo-share-2", name: 'Share-and-Earn' },
  { path: "/user", icon: "cru-fo-user", name: 'Premium User' },
  { icon: "cru-fo-database", name: 'Get CRU', link: 'https://swap.crustapps.net' },
]

function SideLayout(props: Props) {
  const r = useRouter()
  const _onTabClick = useCallback((_: any, { index }: { index: number }) => {
    const m = menus[index]
    if (m.path && m.path !== props.path)
      r.push(m.path)
    if (m.link)
      window.open(m.link, '_blank')
  }, [props.path])
  // const shareEarnIndex = useMemo(() => _.findIndex(menus, m => m.path === '/share-earn'), [])
  const isActive = (info: MenuInfo) => props.path === info.path
  // const isActive2 = (info: MenuInfo) => props.path.startsWith(info.path) && info.isParent

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
              menus.map((mInfo, index) =>
                <PixelBtn
                  unClick={!mInfo.path && !mInfo.link}
                  className={classNames("btn_item", { active: isActive(mInfo) })}
                  onClick={() => _onTabClick(null, { index })}
                  key={`side_menu_${index}`}
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

const sideWidth = '238px'
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
