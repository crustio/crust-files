import { useCallback, useMemo, useState } from "react";
import _ from 'lodash';
export interface AlertMsg {
  title?: string;
  type?: 'success' | 'info' | 'error' | 'warn',
  modal?: boolean,
  msg: string,
}

export interface WrapAlert {
  alert: (msg: AlertMsg) => void,
  alerts: AlertMsg[],
  error: (msg: string, title?: string) => void,
  errorModal: (msg: string, title?: string) => void,
  info: (msg: string, title?: string) => void,
  warn: (msg: string, title?: string) => void,
  warnModal: (msg: string, title?: string) => void,
  success: (msg: string, title?: string) => void,
  close: (msg: AlertMsg) => void,
}

const Tasks: any = {
  last: 0
}

export function initAlert(): WrapAlert {
  const [alerts, setAlerts] = useState<AlertMsg[]>([])
  const alert = useCallback((msg: AlertMsg) => {
    // if (Tasks.last && !msg.modal) {
    //   clearTimeout(Tasks.last)
    //   Tasks.last = 0
    // }
    setAlerts((old) => {
      return _.concat(old, msg)
    })
    if (!msg.modal) {
      Tasks.last = setTimeout(() => {
        Tasks.last = 0
        setAlerts((old) => {
          const drop = _.find(old, item => !item.modal)
          if (drop) return _.filter(old, item => item !== drop)
          return old
        })
      }, 5000)
    }
  }, [])

  const error = useCallback((msg: string, title?: string) => {
    alert({
      type: "error",
      msg,
      title
    })
  }, [alert])

  const errorModal = useCallback((msg: string, title?: string) => {
    alert({
      type: "error",
      modal: true,
      msg,
      title
    })
  }, [alert])

  const info = useCallback((msg: string, title?: string) => {
    alert({
      type: "info",
      msg,
      title
    })
  }, [alert])

  const warn = useCallback((msg: string, title?: string) => {
    alert({
      type: "warn",
      msg,
      title
    })
  }, [alert])
  const warnModal = useCallback((msg: string, title?: string) => {
    alert({
      type: "warn",
      modal: true,
      msg,
      title
    })
  }, [alert])

  const success = useCallback((msg: string, title?: string) => {
    alert({
      type: "success",
      msg,
      title
    })
  }, [alert])
  const close = useCallback((msg: AlertMsg) => {
    setAlerts((old) => _.filter(old, item => item !== msg))
  }, [])

  return useMemo(() => ({ alert, alerts, error, info, warn, success, errorModal, warnModal, close }), [alerts, alert, error, info, warn, success, errorModal, warnModal, close])
}
