import React, {useCallback} from "react";
import {Grid, Menu, Segment, Sidebar} from 'semantic-ui-react'
import {useRouter} from "next/router";
import classNames from "classnames";
import styled from "styled-components";
import Logo from "./Logo";

type Path = '/files' | '/docs' | '/setting'

export interface Props {
  className?: string
  children: any,
  path: Path,
}

interface MenuInfo {
  path: Path,
  icon: string,
  name: string,
}

const menus: MenuInfo[] = [
  {path: "/files", icon: "cru-fo-file", name: 'Upload'},
  {path: "/docs", icon: "cru-fo-file-text", name: 'Docs'},
  {path: "/setting", icon: "cru-fo-settings", name: 'Settings'},
]

function SideLayout(props: Props) {
  const r = useRouter()
  const _onTabClick = useCallback((_: any, {index}: { index: number }) => {
    const m = menus[index]
    if (m.path !== props.path)
      r.push(m.path)
  }, [props.path])

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
          <Logo src="/images/logo_12x.png"/>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Menu fluid vertical borderless>
            {
              menus.map((mInfo, index) => <Menu.Item
                position={"left"}
                key={`side_menu_${index}`}
                index={index}
                active={mInfo.path === props.path}
                icon={<span className={mInfo.icon}/>}
                name={mInfo.name}
                onClick={_onTabClick}
              />)
            }
          </Menu>
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
        font-family: "OpenSans-Regular";

        &.active {
          position: relative;
          color: var(--main-color);
          font-family: "OpenSans-Medium";
          border-right: solid 0.2rem var(--primary-color);
          border-right-style: dot-dash;
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
