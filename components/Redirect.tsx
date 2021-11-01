// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {useEffect} from "react";
import {useContextWrapLoginUser} from "../lib/wallet/hooks";
import {useRouter} from "next/router";
import {MOBILE_WIDTH} from "../lib/config";

export default function Redirect(props: { children: any }) {
  const wUser = useContextWrapLoginUser();
  const router = useRouter();
  useEffect(() => {
    if (router.pathname !== '/mobile' && window.innerWidth <= MOBILE_WIDTH) {
      router.replace('/mobile')
    } else if (router.pathname === '/mobile' && window.innerWidth > MOBILE_WIDTH) {
      router.replace('/')
    }
  }, [router])

  if (router.pathname === '/mobile') return props.children;

  if (!wUser.account && (router.pathname !== '' && router.pathname !== '/')) {
    router.replace('/')
    return null
  }
  if (wUser.account && (router.pathname === '' || router.pathname === '/')) {
    router.replace('/files')
    return null
  }
  return props.children;
}
