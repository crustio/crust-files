import React from "react";
import {useContextWrapLoginUser} from "../lib/wallet/hooks";
import {useRouter} from "next/router";

export default function Redirect(props: { children: any }) {
  const wUser = useContextWrapLoginUser();
  const router = useRouter();
  if (!wUser.account && (router.pathname !== '' && router.pathname !== '/')) {
    router.replace('/')
    return null
  }
  if (wUser.account && (router.pathname === '' || router.pathname === '/') ) {
    router.replace('/files')
    return null
  }
  return props.children
}
