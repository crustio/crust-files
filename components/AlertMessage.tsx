import React, { useContext } from "react";
import { Message } from "semantic-ui-react";
import { AppContext } from "../lib/AppContext";
import { AlertMsg } from "../lib/initAlert";
import styled from "styled-components";
import classNames from "classnames";
import { useRouter } from "next/router";
import Btn from "./Btn";

function getIcon(type: AlertMsg['type']): string {
  if (type === 'success') return "cru-fo-check-circle"
  if (type === 'error') return "cru-fo-x-circle"
  if (type === 'warn') return "cru-fo-info-circle"
  return "cru-fo-info-circle"
}
function getModalTitle(msg: AlertMsg): string {
  if (msg.title) return msg.title
  if (msg.type === 'error') return 'Error'
  if (msg.type === 'warn') return 'Warning'
  if (msg.type === 'success') return 'Success'
  return ''
}

export interface Props {
  className: string
}

function AlertMessage(props: Props) {
  const { className } = props
  const { alert } = useContext(AppContext)

  const r = useRouter()
  const isMain = (r.pathname === '' || r.pathname === '/')
  return <div className={classNames(className, { isMain })}>
    {
      alert.alerts.map((msg, index) =>
        <>
          {
            msg.modal ? <div style={{ position: 'fixed', top: 0, width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0, 0.3)' }}>
              <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ borderBottom: '1px solid #eeeeee', padding: 14 }}>
                  <span style={{ fontSize: 22, color: '#333333', }}>{getModalTitle(msg)}</span>
                  <span className="close cru-fo-x" onClick={() => alert.close(msg)} />
                </div>
                <div style={{ padding: 14, minWidth: '260px', maxWidth: '400px' }}>
                  <div style={{ fontSize: 18, color: '#666666', marginBottom: '1.6rem' }}>
                    {msg.msg}
                  </div>
                  <Btn fluid className="ok" content="OK" onClick={() => alert.close(msg)} />
                </div>
              </div>
            </div> :
              <Message
                className={classNames("msg", "font-sans-regular", { isMain })}
                key={`alert_${index}`}
                size={'small'}
              >
                <span className={`cru-fo ${getIcon(msg.type)} ${msg.type}`} />
                {msg.title && <Message.Header>{msg.title}</Message.Header>}
                <Message.Content>{msg.msg}</Message.Content>
              </Message>
          }
        </>)
    }
  </div>
}

export default React.memo(styled(AlertMessage)`
  position: fixed;
  width: 100%;
  height: 0;
  overflow: visible;
  z-index: 10000;
  top: 2.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 0;

  .msg {
    flex-shrink: 0;
    display: block;
    padding: 1.14rem 1.7rem;
    background: #FFFFFF;
    box-shadow: 0 0.57rem 1.14rem 0 rgba(0, 0, 0, 0.1) !important;
    border-radius: 0.86rem !important;
    border: 0.07rem solid #EEEEEE;
    
    &.isMain {
      background-color: rgba(255, 255, 255, 0.15);
      border: unset;
      margin-right: 3.4rem;
      align-self: flex-end;

      .content {
        color: white !important;
      }
    }

    .content {
      display: inline-block;
      color: var(--secend-color) !important;
      font-size: 1.14rem;
    }
  }

  .cru-fo {
    font-size: 1.4rem;
    float: left;
    margin-right: 0.8rem;
    display: inline-block;
  }

  .success {
    color: #56CB8F;
  }

  .error {
    color: #F37565;
  }

  .warn {
    color: #cbae56;
  }

  .info {
    color: #3b62d2;
  }


  .close {
    cursor: pointer;
    float: right;
    margin-top: 5px;
    vertical-align: baseline;
    right: 1rem;
    font-size: 1rem;
    color: #666666;
    &:hover {
      color: #333333;
    }
  }
`)
