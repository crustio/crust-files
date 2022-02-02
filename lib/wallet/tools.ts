import { SubmittableExtrinsic } from "@polkadot/api/types"
import { ISubmittableResult } from "@polkadot/types/types"

export function sleep(time: number): Promise<void> {
  return new Promise<void>((resolve => {
    setTimeout(resolve, time)
  }))
}


const findEvent = (res, key) => {
  return res.events.find((e) => `${e.event.section.toString()}(${e.event.method.toString()})` === key)
}

export function finalTxSignAndSend(tx: SubmittableExtrinsic<'promise', ISubmittableResult>, pair) {
  return new Promise<void>((resolve, reject) => {
    tx.signAndSend(pair, { nonce: -1, tip: 0 }, (res) => {
      if (res.status.isFinalized) {
        const txCompletd = !!findEvent(res, 'system(ExtrinsicSuccess)')
        if (txCompletd) {
          resolve()
        } else {
          reject('Error')
        }
      } if (res.status.isFinalityTimeout || res.status.isRetracted) {
        reject('Timeout')
      }
    }).catch(reject)
  })
}
export function finalTxSend(tx: SubmittableExtrinsic<'promise', ISubmittableResult>) {
  return new Promise<void>((resolve, reject) => {
    tx.send((res) => {
      if (res.status.isFinalized) {
        const txCompletd = !!findEvent(res, 'system(ExtrinsicSuccess)')
        if (txCompletd) {
          resolve()
        } else {
          reject('Error')
        }
      } if (res.status.isFinalityTimeout || res.status.isRetracted) {
        reject('Timeout')
      }
    }).catch(reject)
  })
}
