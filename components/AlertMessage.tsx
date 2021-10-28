import React, {useContext} from "react";
import {List, Message, SemanticCOLORS} from "semantic-ui-react";
import {AppContext} from "../lib/AppContext";
import {AlertMsg} from "../lib/initAlert";

function getColor(type: AlertMsg['type']): SemanticCOLORS {
  if (type === 'success') return "green"
  if (type === 'error') return "red"
  if (type === 'warn') return "yellow"
  return "blue"
}

export function AlertMessage() {
  const {alert} = useContext(AppContext)
  return <List animated style={{position: 'fixed', zIndex: 10000, right: 20, top: 100}}>
    {
      alert.alerts.map((msg, index) =>
        <Message
          key={`alert_${index}`}
          color={getColor(msg.type)}
          size={'small'}
          style={{ padding: '0.8rem 1rem', minWidth: 300, boxShadow: '0 0 10px rgba(0,0,0, 0.3)' }}
        >
          {msg.title && <Message.Header>{msg.title}</Message.Header>}
          <Message.Content>{msg.msg}</Message.Content>
        </Message>)
    }
  </List>
}
