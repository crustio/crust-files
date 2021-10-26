import React, {useCallback} from "react";
import {Grid, Icon, Image, Menu, Segment, SemanticICONS, Sidebar} from 'semantic-ui-react'
import {useRouter} from "next/router";
import classNames from "classnames";
import styled from "styled-components";

type Path = '/files' | '/docs' | '/setting'

export interface Props {
  className?: string
  children: any,
  path: Path,
}

interface MenuInfo {
  path: Path,
  icon: SemanticICONS,
  name: string,
}

const menus: MenuInfo[] = [
  {path: "/files", icon: "file outline", name: 'Upload'},
  {path: "/docs", icon: "file alternate outline", name: 'Docs'},
  {path: "/setting", icon: "setting", name: 'Setting'},
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
      className={'font1 basic'}
    >
      <Grid textAlign='center'>
        <Grid.Row columns={1} className={"logoPanel"}>
          <Image size={'small'} src={"/images/logo_1.png"}/>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Menu fluid vertical borderless>
            {
              menus.map((mInfo, index) => <Menu.Item
                position={"left"}
                key={`side_menu_${index}`}
                index={index}
                active={mInfo.path === props.path}
                icon={<Icon name={mInfo.icon}/>}
                name={mInfo.name}
                onClick={_onTabClick}
                className="font1"
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

export default React.memo<Props>(styled(SideLayout)`
  overflow: hidden;
  height: 100vh;
  background: white;

  .ui.sidebar {
    background: #F5F5F5;
    box-shadow: unset !important;
    .logoPanel {
      padding: 2rem 0;
    }
    .menu {
      box-shadow: unset !important;
      border: unset !important;
      border-radius: unset !important;
      background: unset !important;

      .item {
        border-radius: 0;
        text-align: left;
        padding-left: 2rem !important;
        font-weight: 500;
        font-size: 1.3rem;
        color: var(--secend-color);

        &.active {
          color: var(--main-color);
        }

        .icon {
          float: left;
          margin-right: 10px;
        }
      }
    }
  }

  .pusher {
    width: calc(100vw - 260px);
    height: 100vh;
    overflow: auto !important;
    background: white;
  }
`)
