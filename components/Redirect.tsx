// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Device from "device.js";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
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

const NO_CHECK_USER = ["/files/share", "/files/receive",'/upfile'];
export default function Redirect(props: { children: any }) {
  const wUser = useContextWrapLoginUser();
  const router = useRouter();
  useEffect(() => {
    const isMobile = new Device().mobile;
    if (router.pathname !== "/mobile" && isMobile) {
      // router.replace("/mobile");
    } else if (router.pathname === "/mobile" && !isMobile) {
      router.replace("/");
    }
  }, [router]);

  // no support mobile
  if (router.pathname === "/mobile") return props.children;
  // no check user
  if (NO_CHECK_USER.includes(router.pathname)) return props.children;

  // check user
  if ((!wUser.account || !wUser.authBasic) && router.pathname !== "" && router.pathname !== "/") {
    router.replace("/");
    return <RedirectLoading>{props.children}</RedirectLoading>;
  }

  if (wUser.account && wUser.authBasic && (router.pathname === "" || router.pathname === "/")) {
    router.replace(`/home/${window.location.search}`);
    return <RedirectLoading>{props.children}</RedirectLoading>;
  }
  return props.children;
}
