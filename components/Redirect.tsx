// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Device from 'device.js';
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useContextWrapLoginUser } from "../lib/wallet/hooks";

const NO_CHECK_USER = [
  '/files/share',
  '/files/receive'
]
export default function Redirect(props: { children: any }) {
  const wUser = useContextWrapLoginUser();
  const router = useRouter();
  useEffect(() => {
    const isMobile = new Device().mobile
    if (router.pathname !== '/mobile' && isMobile) {
      router.replace('/mobile')
    } else if (router.pathname === '/mobile' && !isMobile) {
      router.replace('/')
    }
  }, [router])

  // no support mobile
  if (router.pathname === '/mobile') return props.children;
  // no check user
  if (NO_CHECK_USER.includes(router.pathname)) return props.children;

  // check user
  if ((!wUser.account || !wUser.authBasic) && (router.pathname !== '' && router.pathname !== '/')) {
    router.replace('/')
    return null
  }
  
  if (wUser.account && wUser.authBasic && (router.pathname === '' || router.pathname === '/')) {
    router.replace(`/home/${window.location.search}`)
    return null
  }
  return props.children;
}
