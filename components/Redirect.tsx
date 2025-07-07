'use client'

import { usePathname } from "@/lib/usePathname";
import { useRouter } from "next/navigation";
import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { useContextWrapLoginUser } from "../lib/wallet/hooks";

function RedirectLoading(p: { children?: React.ReactNode }) {
  return (
    <>
      {p.children}
      <Dimmer active inverted style={{ position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh" }}>
        <Loader active inverted size="large" />
      </Dimmer>
    </>
  );
}

const NO_CHECK_USER = ["/files/share", "/files/receive", '/upfile'];
export default function Redirect(props: { children: any }) {
  const wUser = useContextWrapLoginUser();
  const router = useRouter();
  const pathname = usePathname() ?? ''
  // // no support mobile
  // if (router.pathname === "/mobile") return props.children;
  // no check user
  if (NO_CHECK_USER.includes(pathname)) return props.children;

  // check user
  if ((!wUser.account || !wUser.authBasic) && pathname !== "" && pathname !== "/") {
    setTimeout(() => router.replace("/"), 50);
    return <RedirectLoading>{props.children}</RedirectLoading>;
  }

  if (wUser.account && wUser.authBasic && (pathname === "" || pathname === "/")) {
    setTimeout(() => router.replace(`/home/${window.location.search}`), 50)
    return <RedirectLoading>{props.children}</RedirectLoading>;
  }
  return props.children;
}
