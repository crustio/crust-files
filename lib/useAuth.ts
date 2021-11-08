// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useMemo, useState} from 'react';
import {AuthIpfsEndpoint, AuthIpfsPinner, createAuthIpfsEndpoints, createAuthIpfsPinner} from './config';
import {useTranslation} from 'react-i18next';

export interface AuthGateway {
  endpoint: AuthIpfsEndpoint,
  setEndpoint: (p: AuthIpfsEndpoint) => void,
  onChangeEndpoint: (_: any, {value}: { value: string }) => void,
  endpoints: AuthIpfsEndpoint[],
}

export function useAuthGateway(): AuthGateway {
  const {t} = useTranslation();
  const endpoints = useMemo(
    () => createAuthIpfsEndpoints(t)
      .map((item) => ({...item, text: `${item.text ?? ''} (${item.location ?? ''})`})),
    [t]
  );
  const defaultIndex = useMemo(() => Math.floor(Math.random() * (endpoints.length - 2)),[])
  const [endpoint, setEndpoint] = useState<AuthIpfsEndpoint>(endpoints[defaultIndex]);

  const onChangeEndpoint = useCallback((_: any, {value}: { value: string }) => {
    const find = endpoints.find((item) => item.value === value);

    if (find) setEndpoint(find);
  }, [endpoints]);

  return useMemo(() => ({
    endpoints,
    endpoint,
    setEndpoint,
    onChangeEndpoint
  }), [endpoints, endpoint, onChangeEndpoint]);
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
