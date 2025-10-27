'use client'

import { useRouter } from "next/navigation";
import React from "react";
import styled from "styled-components";
import PageUserSideLayout from "@/components/PageUserSideLayout";
import { BaseProps } from "@/components/types";
import { ScreenMobile } from "@/lib/config";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

function home(p: BaseProps) {
  const r = useRouter();
  const _onClickPublick = () => r.push('/files')
  const _onClickShareAndEarn = () => r.push("/share-earn");
  const _onClickVault = () => r.push("/files/vault");
  const _onClickUser = () => r.push("/user");
  const _onClickPay2Download = () => {
    window.location.href = "https://p2d.crustapps.net/";
  };
  const isMobile = useIsMobile()
  return (
    <PageUserSideLayout path="/home" className={p.className}>
      <div className="home--slog">
        Upload and store your file to IPFS <br />
        via{" "}
        <a target="_blank" href="https://crust.network/" rel="noreferrer">
          Crust
        </a>
        ’s decentralized storage network.
      </div>
      {!isMobile && <div className="home--activity">
        <img className="hot-sale" src="/images/fire.png" />
        <a onClick={_onClickShareAndEarn}>Share-and-Earn</a>
      </div>}
      <div className="home--cards">
        <div className="home--card" onClick={_onClickPublick}>
          <div className="home--card-inner">
            <div className="home--card--front">
              <img src="/images/w4.png" className="img-fluid" />
              <h5>File Sharing</h5>
              <p>Share your files with the public or totally in secret</p>
            </div>
            <div className="home--card--back">
              <h5>FILE SHARING</h5>
              <p>Share your files with friends, family and colleagues via direct link or with your personalized Twitter link.</p>
            </div>
          </div>
        </div>
        <div className="home--card" onClick={_onClickVault}>
          <div className="home--card-inner">
            <div className="home--card--front">
              <img src="/images/w2.png" className="img-fluid" />
              <h5>Vault</h5>
              <p>100% secured and client side encrypted file storage</p>
            </div>
            <div className="home--card--back">
              <h5>VAULT</h5>
              <p>Encrypted cloud storage with the highest security possible. Nobody else but you is holding the keys to your most sensitive and private data. </p>
              {/* <a href="#0">Learn more</a> */}
            </div>
          </div>
        </div>
      </div>
      {!isMobile && <div className="home--user-link">
        <a onClick={_onClickUser}>Become a Premium User and get more storage space</a>
      </div>}
    </PageUserSideLayout>
  );
}

export const Home = React.memo(
  styled(home)`
    color: var(--main-color);
    .pusl_center_flex_content {
      // width: 76.24rem;
      min-width: unset;
    }
    .home--slog {
      display: inline-block;
      font-size: 3.428571rem;
      font-weight: 600;
      line-height: 4.642857rem;
      margin-top: 5rem;
      a {
        color: var(--primary-color);
      }
    }
    .home--activity {
      cursor: pointer;
      position: absolute;
      display: flex;
      align-items: end;
      right: 20rem;
      top: 4rem;
    }

    .home--user-link {
      cursor: pointer;
      display: flex;
      text-align: center;
      margin-top: 10rem;
    }

    .home--user-link a {
      font-size: 2rem;
      margin: 0 auto;
    }

    .home--activity a {
      font-size: 24px;
    }

    .hot-sale {
      width: 2rem;
      height: 2rem;
      color: red;
      margin-right: 4px;
    }

    .home--card--back {
      background-color: #202020;
      color: white;
      transform: rotateY(180deg);
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .home--card h5 {
      font-size: 22px;
    }
    .home--card p {
      font-size: 18px;
    }

    .home--cards {
      display: grid;
      width: 100%;
      margin: 2rem auto;
      height: max-content;
      grid-template-columns: repeat(2, calc(50% - 1rem));
      gap: 1.5rem;

      .home--card {
        width: 100%;
        flex-shrink: 0;
        cursor: pointer;
        &:hover {
          .home--card--front {
            display: none;
          }
          .home--card-inner {
            transform: rotateY(180deg);
          }
        }
      }
      .home--card-inner {
        overflow: hidden;
        display: flex;
        width: 100%;
        flex-direction: row;
        box-shadow: 4px 4px 25px rgb(0 0 0 / 20%);
        border-radius: 20px;
        text-align: center;
        transition: all 0.6s;
        transform-style: preserve-3d;
        height: 100%;
        min-height: max-content;
      }

      .home--card--front,
      .home--card--back {
        border-radius: 20px;
        width: 100%;
        flex-shrink: 0;
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100%;
      }

      .home--borderBottom1 {
        border-bottom: 5px solid #92d8f7;
      }
      .home--borderBottom2 {
        border-bottom: 5px solid #a7ecc9;
      }
      .home--borderBottom3 {
        border-bottom: 5px solid #ffd7a6;
      }

      .home--card-Content {
        font-size: 1.142857rem;
        line-height: 1.571429rem;
        white-space: pre-wrap;
        margin-top: 1.857143rem;
      }

      .home--CommingSoon {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        line-height: 2.6rem;
        background-color: white;
        width: 100%;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 2.285714rem;
        white-space: nowrap;
        span {
          color: var(--primary-color);
          text-decoration: underline;
        }
      }
    }
    ${ScreenMobile} {
      .home--slog{
        font-size: 21px;
        font-weight: 600;
        padding-bottom: 20px;
        line-height: 1.5;
      }
      .home--cards {
        grid-template-columns: repeat(1, minmax(0, 1fr));
        margin: 0;
        .home--card {
          height: 30rem;
        }

        .home--card h5 {
          font-size: 16px;
        }
        .home--card p {
          font-size: 14px;
        }
      }
    }
  ` as any
) as any;

export default Home;
