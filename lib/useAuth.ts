// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {Dispatch, SetStateAction, useCallback, useMemo, useState} from 'react';
import {AuthIpfsEndpoint, AuthIpfsPinner, createAuthIpfsEndpoints, createAuthIpfsPinner} from './config';
import {useTranslation} from 'react-i18next';
import store from 'store';

export interface AuthGateway {
  endpoint: AuthIpfsEndpoint,
  setEndpoint: Dispatch<SetStateAction<AuthIpfsEndpoint>>,
  onChangeEndpoint: (_: any, {value}: { value: string }) => void,
  endpoints: AuthIpfsEndpoint[],
}


export interface LastGateway {
  value: string
}

export function useAuthGateway(key = 'upload:last-gateway'): AuthGateway {
  const {t} = useTranslation();
  const endpoints = useMemo<AuthIpfsEndpoint[]>(
    () => createAuthIpfsEndpoints(t)
      .map((item) => ({...item, text: `${item.text ?? ''} (${item.location ?? ''})`})),
    [t]
  );

  const defaultIndex = useMemo<number>(() => {
    const lg = store.get(key) as LastGateway
    if (lg) {
      const index = endpoints.findIndex(item => item.value === lg.value)
      if (index >= 0) return index
    }
    return 0
  }, [key, endpoints])

  const [endpoint, setEndpoint] = useState<AuthIpfsEndpoint>(endpoints[defaultIndex]);

  const _setEndpoint = useCallback((action: SetStateAction<AuthIpfsEndpoint>) => {
    setEndpoint((old) => {
      const data = typeof action === 'function' ? action(old) : action as AuthIpfsEndpoint
      store.set(key, {value: data.value})
      return data;
    })
  }, [])

  const onChangeEndpoint = useCallback((_: any, {value}: { value: string }) => {
    const find = endpoints.find((item) => item.value === value);
    if (find) _setEndpoint(find);
  }, [endpoints, _setEndpoint]);


  return useMemo(() => ({
    endpoints,
    endpoint,
    setEndpoint: _setEndpoint,
    onChangeEndpoint
  }), [endpoints, endpoint, _setEndpoint, onChangeEndpoint]);
}

export interface AuthPinner {
  pinner: AuthIpfsPinner,
  setPinner: (p: AuthIpfsPinner) => void,
  pins: AuthIpfsPinner[],
  onChangePinner: (_: any, {value}: { value: string }) => void,
}

export function useAuthPinner(): AuthPinner {
  const {t} = useTranslation();
  const pins = useMemo(
    () => createAuthIpfsPinner(t)
      .sort(() => Math.random() > 0.5 ? -1 : 1)
      .map((item) => ({...item, text: `${item.text ?? 'Pinner'}`})),
    [t]
  );

  const [pinner, setPinner] = useState<AuthIpfsPinner>(pins[0]);

  const onChangePinner = useCallback((_: any, {value}: { value: string }) => {
    const find = pins.find((item) => item.value === value);

    if (find) setPinner(find);
  }, [pins]);

  return useMemo(() => ({
    pinner,
    pins,
    setPinner,
    onChangePinner
  }), [pinner, pins, onChangePinner]);
}
