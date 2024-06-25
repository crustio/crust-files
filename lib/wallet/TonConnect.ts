import { TonProofItemReplySuccess } from '@tonconnect/sdk';
import { TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui-react';
import { Buffer } from 'buffer';
import { createHash } from 'crypto';
import { numberToBytes } from 'viem';
import { IS_DEV } from '../env';
import { getPerfix } from './tools';
import type { BaseWallet, LoginUser } from './types';


interface Domain {
    LengthBytes: number // uint32 `json:"lengthBytes"`
    Value: string // string `json:"value"`
  }
  
  interface ParsedMessage {
    Workchain: number // int32
    Address: Buffer // []byte
    Timstamp: number // int64
    Domain: Domain // Domain
    Signature: Buffer // []byte
    Payload: string // string
    StateInit: string // string
  }
const tonProofPrefix = 'ton-proof-item-v2/'
const tonConnectPrefix = 'ton-connect'

export async function CreateMessage(message: ParsedMessage): Promise<Buffer> {
  const wc = Buffer.from(numberToBytes(message.Workchain, { size: 4 }))
  const ts = Buffer.from(numberToBytes(message.Timstamp, { size: 8 }).reverse())
  const dl = Buffer.from(numberToBytes(message.Domain.LengthBytes, { size: 4 }).reverse())

  const m = Buffer.concat([
    Buffer.from(tonProofPrefix),
    wc,
    message.Address,
    dl,
    Buffer.from(message.Domain.Value),
    ts,
    Buffer.from(message.Payload),
  ])

  // const messageHash =  //sha256.Sum256(m)
  // const messageHash = await crypto.subtle.digest('SHA-256', m)
  // const m = Buffer.from(tonProofPrefix)
  // m.write(ts)

  // m := []byte(tonProofPrefix)
  // m = append(m, wc...)
  // m = append(m, message.Address...)
  // m = append(m, dl...)
  // m = append(m, []byte(message.Domain.Value)...)
  // m = append(m, ts...)
  // m = append(m, []byte(message.Payload)...)

  const messageHash = createHash('sha256').update(m).digest()

  const fullMes = Buffer.concat([
    Buffer.from([0xff, 0xff]),
    Buffer.from(tonConnectPrefix),
    Buffer.from(messageHash),
  ])
  // []byte{0xff, 0xff}
  // fullMes = append(fullMes, []byte(tonConnectPrefix)...)
  // fullMes = append(fullMes, messageHash[:]...)

  // const res = await crypto.subtle.digest('SHA-256', fullMes)
  const res = createHash('sha256').update(fullMes).digest()
  return Buffer.from(res)
}



export class TonConnect implements BaseWallet{
    isInit: boolean;
    tonconnectui: TonConnectUI
    tonProof?: TonProofItemReplySuccess

    async init(): Promise<void> {
        if(this.isInit) return
        const payload =  await fetch('https://tonapi.io/v2/tonconnect/payload').then(res => res.json()).then(res => res.payload)
        this.tonProof = undefined
        this.tonconnectui = new TonConnectUI({
            manifestUrl: `${window.location.origin}/tonconnect-manifest${IS_DEV?'-dev':''}.json`,
        });
        this.tonconnectui.setConnectRequestParameters({state: 'ready', value: { tonProof: payload }})
        this.tonconnectui.onStatusChange((walelt) => {
            this.tonProof = undefined
            if(walelt?.connectItems?.tonProof){
                const tonProof = walelt.connectItems.tonProof as TonProofItemReplySuccess
                if(tonProof.proof){
                    this.tonProof = tonProof
                }
            }
            console.info('tonwallet:', walelt)
        })
        this.isInit = true;
    }

    async sign(_data: string, _account?: string): Promise<string> {
        throw "Not implementation"
    }

    async login(f?: LoginUser): Promise<[string[], LoginUser]> {
        if(!this.tonProof) throw 'TonConnect tonProof not found'
        const account = this.tonconnectui.account?.address
        const signer = this.tonconnectui.account?.publicKey
        const walletStateInit = this.tonconnectui.account?.walletStateInit
        if(!account || !signer || !walletStateInit) throw 'TonConnect account not found'
        const toTonAddress = (account: string) => toUserFriendlyAddress(account, !account.startsWith('0:'))
        const tonAddress = toTonAddress(account)
        const nUser: LoginUser = { account: tonAddress, wallet: 'ton-connect' }
        const prefix = getPerfix(nUser)
        const [workChain,hash] = account.split(':')
        const parsed: ParsedMessage = {
            Workchain: Number(workChain),
            Address: Buffer.from(hash,'hex'),
            Domain: {
                LengthBytes: this.tonProof.proof.domain.lengthBytes,
                Value: this.tonProof.proof.domain.value,
            },
            Signature: Buffer.from(this.tonProof.proof.signature, 'base64'),
            Payload: this.tonProof.proof.payload,
            StateInit: walletStateInit,
            Timstamp: this.tonProof.proof.timestamp,
        }
        const message = await CreateMessage(parsed)
        const hexData = message.toString('hex')
        const signature = this.tonProof.proof.signature
        const perSignData = `${prefix}-${signer}-${hexData}:${signature}`;
        const base64Signature = window.btoa(perSignData);
        const authBasic = `${base64Signature}`;
        const authBearer = `${base64Signature}`;
        nUser.authBasic = authBasic;
        nUser.authBearer = authBearer;
        nUser.pubKey = signer

        console.info('hexData', hexData)
        console.info('signer', signer)
        console.info('signature', signature)
        return [[tonAddress], nUser]
    }

} 