// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import Device from "device.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dimmer, Loader, Progress } from "semantic-ui-react";
import { useContextWrapLoginUser } from "../lib/wallet/hooks";

function RedirectLoading(p: { children?: React.ReactNode }) {
  // const [percent, setPercent] = useState(0);
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setPercent((p) => {
  //       p >= 80 && clearInterval(timer);
  //       return p + 1;
  //     });
  //   }, 200);
  //   return () => clearInterval(timer);
  // }, []);
  return (
    <>
      {p.children}
      <Dimmer active inverted style={{ position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh" }}>
        <Loader active inverted size="large" />
      </Dimmer>
      {/* <Progress
        success
        percent={percent}
        indicating
        size="tiny"
        style={{ position: "fixed", zIndex: 1000, top: 0, left: 0, width: "100%" }}
      /> */}
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
      router.replace("/mobile");
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
