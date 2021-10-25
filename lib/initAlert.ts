import {useCallback, useMemo, useState} from "react";
import _ from 'lodash';

export interface AlertMsg {
  title?: string;
  type?: 'success' | 'info' | 'error' | 'warn',
  msg: string,
}

export interface WrapAlert {
  alert: (msg: AlertMsg) => void,
  alerts: AlertMsg[],
}

export function initAlert(): WrapAlert {
  const [alerts, setAlerts] = useState<AlertMsg[]>([])
  const alert = useCallback((msg: AlertMsg) => {
    setAlerts((old) => {
      return _.concat(old, msg)
    })
    setTimeout(() => {
      setAlerts((old) => {
        return _.drop(old)
      })
    }, 5000)
  }, [])

  return useMemo(() => ({alert, alerts}), [alerts, alert])
}
