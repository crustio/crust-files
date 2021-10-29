import React from "react";
import styled from "styled-components";
import SideLayout from "../components/SideLayout";
import {Accordion, Icon, Segment} from "semantic-ui-react";
import User from "../components/User";
import {useToggle} from "../lib/hooks/useToggle";

export interface Props {
  className?: string
}

interface DocsItem {
  title: string
  sub: string[]
}

const DOCS: DocsItem[] = [
  {
    title: 'What is Crust Files?',
    sub: [
      "Crust Files is a Web3.0 decentralized IPFS storage application.",
      "Crust Files helps you to easily store your personal files on IPFS via Crust’s decentralized storage network."
    ]
  },
  {
    title: 'More Detailed Features',
    sub: [
      "> Multi-Wallet Access, Web3.0 Identity",
      "> End-to-end File Encryption",
      "> Share Links to Friends",
      "> Long-term IPFS Storage with Replicas Worldwide",
      "> Retrieve Anywhere & Anytime",
      "> Open-source, Decentralized-hosted"
    ]
  },
  {
    title: 'What Wallet Does It Support?',
    sub: [
      "Crust Files supports multi-wallets as Web3.0 identity to sign-in the application and use its Web3.0 Auth IPFS Gateway & Web3.0 Auth Crust Pinner. ",
      "> Crust Network – Browser Wallet",
      "> Ethereum & Polygon – MetaMask",
      "> Polkadot – Browser {.js} Extension",
      "> NEAR",
      "> Solana",
      "> Elrond",
      "> FLOW"
    ]
  },
  {
    title: 'What’s More to Expect in the Future',
    sub: [
      "> More blockchain platforms and wallets sign-in supported.",
      "> Smart Contract on various platforms, so that users are able to Deposit / Pay to use Crust Files.",
      "> Customizable IPFS Gateways.",
      "> Native folder structure management.",
      "> On-chain storage for account info."
    ]
  },
  {
    title: 'Developer’s Guide',
    sub: [
      "Please refer to this link:",
      "<a target='_blank' href='https://wiki.crust.network/docs/en/buildGettingStarted'>https://wiki.crust.network/docs/en/buildGettingStarted<a/>"
    ]
  },
  {
    title: 'About IPFS Web3-Auth Gateway',
    sub: [
      "IPFS W3Auth Gateway is a lightweight Web3-based authentication service based on IPFS gateway and reverse proxy.",
      "For detailed information, Please refer to this link:",
      "<a target='_blank' href='https://wiki.crust.network/docs/en/buildIPFSWeb3AuthGW'>https://wiki.crust.network/docs/en/buildIPFSWeb3AuthGW</a>",
    ]
  },
  {
    title: 'About IPFS Web3-Auth Crust Pinner',
    sub: [
      "IPFS W3Auth Pinning Service is a lightweight Web3-based authentication service based on IPFS remote pinning service and Crust Network.",
      "For detailed information, Please refer to this link:",
      "<a target='_blank' href='https://wiki.crust.network/docs/en/buildIPFSW3AuthPin'>https://wiki.crust.network/docs/en/buildIPFSW3AuthPin</a>",
    ]
  },
  {
    title: 'About Local Cache',
    sub: [
      "Crust Files is a decentralized Application, and it will NEVER store your Upload History and File Encryption Key on any remote server. Instead, they are cached on your local devices. This indicates that, if you sign-in Crust Files with your wallet account on a new device, you will lose your Upload History and File Encryption Key from your previous device.",
      "If you want to migrate your Upload History and File Encryption Key to a new device, use Export & Import function on the Upload page.",
      "Note1: File Encryption Key can always be imported / recovered from Seed Phrase on the Settings page.",
      "Note2: We are working on a possible solution so that your account-linked information, such as your Upload History, File Encryption Key and Folder Structure can be stored on-chain."
    ]
  },

]

const Item = ({item, index}: { item: DocsItem, index: number }) => {
  const [active, toggleActive] = useToggle(index < 1)
  return <>
    <Accordion.Title index={index} active={active} onClick={() => toggleActive()}>
      {item.title}
      <Icon name={'dropdown'}/>
    </Accordion.Title>
    <Accordion.Content active={active}>
      {
        item.sub.map((str, i) =>
          <div key={`str_${index}_${i}`} dangerouslySetInnerHTML={{__html: str}}/>)
      }
    </Accordion.Content>
  </>
}

function Docs(props: Props) {
  const {className} = props
  return <SideLayout path={'/docs'}>
    <Segment basic className={className}>
      <User/>
      <Accordion>
        {
          DOCS.map((item, index) =>
            <Item
              key={`docs_item_${index}`}
              item={item}
              index={index}
            />)
        }
      </Accordion>
    </Segment>
  </SideLayout>
}

export default React.memo<Props>(styled(Docs)`
  padding: unset !important;

  .ui.accordion {
    padding: 3rem 2.8rem;

    .title {
      font-family: "ArialRoundedMTBold";
      font-size: 1.6rem;
    }

    .content {
      font-size: 1.2rem;
      color: var(--secend-color);
    }
  }
`)
