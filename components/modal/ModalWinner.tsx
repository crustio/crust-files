import React from "react";
import { Modal, ModalProps, Table } from "semantic-ui-react";
import styled from "styled-components";
import { Winner } from "../../lib/http/types";
import { shortStr } from "../../lib/utils";
import { SubscanAddress, SubscanHash } from "../texts/links";
export interface Props extends ModalProps {
  toggleOpen: (open?: boolean) => void,
  winners: Winner[],
}

const MTable = styled(Table)`
  thead {
    font-family: OpenSans-SemiBold;
    font-size: 15px;
    th {
      border-bottom: unset !important;
    }
  }
  tbody {
    font-size: 14px;
    tr, td {
      border-top: unset !important;
    }
    tr:nth-child(2n - 1) {
        background-color: #f8f8f8;

        td:first-child {
          overflow: hidden;
          border-top-left-radius: 0.57rem;
          border-bottom-left-radius: 0.57rem;
        }

        td:last-child {
          overflow: hidden;
          border-top-right-radius: 0.57rem;
          border-bottom-right-radius: 0.57rem;
        }
    }
  }
`

function ModalWinner(props: Props) {
  const { toggleOpen, winners, ...other } = props

  return <Modal closeIcon={<span className="close icon cru-fo-x" />} onClose={() => toggleOpen(false)} {...other}>
    <Modal.Header content={'Winning Accounts'} />
    <Modal.Content>
      <MTable basic="very" textAlign="center">
        <Table.Header>
          <Table.HeaderCell>Account</Table.HeaderCell>
          <Table.HeaderCell>Deposit Tx Hash</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {
            winners.map((w, index) => <Table.Row key={`winners_${index}`}>
              <Table.Cell><SubscanAddress account={w.memberAddress}>{shortStr(w.memberAddress)}</SubscanAddress></Table.Cell>
              <Table.Cell><SubscanHash hash={w.extrinsicHash}>{shortStr(w.extrinsicHash)}</SubscanHash></Table.Cell>
            </Table.Row>)
          }
        </Table.Body>
      </MTable>
    </Modal.Content>
  </Modal>
}

export default React.memo<Props>(styled(ModalWinner)`
  overflow: unset !important;
  width: 50rem !important;
  
  .header {
    height: 55px;
    font-size: 18px !important;
    padding: 0 16px !important;
    font-weight: 600 !important;
    line-height: 55px !important;
    border-top-right-radius: 0.6rem !important;
    border-top-left-radius: 0.6rem !important;
  }


  .close.icon {
    top: 7px;
    right: 8px;
    color: #666666;
  }

  .content {
    overflow: auto;
    height: 500px;
    padding: 1rem !important;
    border-bottom-right-radius: 0.6rem !important;
    border-bottom-left-radius: 0.6rem !important;
    /* .btns {
      padding-top: 2.3rem;

      button {
        width: calc(50% - 0.5rem) !important;
        margin: unset;
      }

      button:first-child {
        margin-right: 1rem;
      }
    }  */
  }
`)
