import {useCallback, useEffect, useMemo, useState} from "react";
import store from 'store';
import {useToggle} from "../hooks/useToggle";

const {Cypher} = require("@zheeno/mnemonic-cypher");
const WordsCount = 8
const myCypher = new Cypher(WordsCount)

export interface UserCrypto {
  secret?: string,
  seeds?: string,
}

export interface WrapUserCrypto extends UserCrypto {
  generate: () => Promise<UserCrypto>,
  set: (uc: UserCrypto) => void,
  init: boolean,
}

export const readFileAsync = (file: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      reader.result && resolve(reader.result as ArrayBuffer)
    }

    reader.onerror = reject

    reader.readAsArrayBuffer(file)
  })
}



export function parseUserCrypto(value?: string): UserCrypto | null {
  try {
    const tValue = value && value.trim()
    if (tValue) {
      const mWords = tValue.split(' ')
      if (mWords.length === 1 && mWords[0]) {// secret
        const secret = mWords[0]
        const bSecret = window.atob(secret)
        const seeds = myCypher.phraseFromSecret(bSecret)
        if (seeds && seeds.split(' ').length >= 4) {
          return {secret, seeds}
        }
      } else if (mWords.length >= 4) {// words
        const secret = myCypher.secretFromPhrase(tValue)
        if (secret && secret.split('-').length >= 4) {
          return {secret: window.btoa(secret), seeds: tValue}
        }
      }
    }
    return null
  } catch (_) {
    return null
  }
}

export function useUserCrypto(): WrapUserCrypto {
  const [userCrypto, setUserCrypto] = useState<UserCrypto>({})
  const [init, toggleInit] = useToggle()
  useEffect(() => {
    const uc = store.get('user:crypto') as UserCrypto
    if (uc) {
      setUserCrypto(uc)
    }
    toggleInit(true)
  }, [])
  const set = useCallback((uc: UserCrypto) => {
    setUserCrypto(uc)
    store.set('user:crypto', uc)
  }, [])
  const generate = useCallback<WrapUserCrypto['generate']>(async () => {
    const cypher = new Cypher(WordsCount)
    const {secret, mnemonics} = cypher.genMnemonics()
    const uc: UserCrypto = {
      secret: window.btoa(secret),
      seeds: mnemonics
    }
    set(uc)
    return uc
  }, [])


  return useMemo(() => ({
    ...userCrypto,
    generate,
    set,
    init,
  }), [userCrypto, set, init, generate])
}
