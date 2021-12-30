import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import PageUserSideLayout from '../components/PageUserSideLayout';
import { BaseProps } from '../components/types';
import { useGetDepost } from '../lib/hooks/useGetDeposit';

function home(p: BaseProps) {
    const r = useRouter()
    const { isPremiumUser } = useGetDepost()
    const _onClickPublick = () => r.push('/files')
    const _onClickVault = () => isPremiumUser && r.push('/files/vault')

    return <PageUserSideLayout path='/home' className={p.className}>
        <div className="home--slog">
            Upload and store your File to IPFS <br />
            via <a target="_blank" href="https://crust.network/" rel="noreferrer">Crust</a>’s decentralized storage network.
        </div>
        <div className="home--cards">
            <div className="home--card" onClick={_onClickPublick}>
                <div className="home--card-Title home--borderBottom1">Public</div>
                <div className="home--card-Content">
                    Your file will be just as it is supposed to be. No encryption, open access for all. It’s perfectly suitable for storing and sharing non-sensitive files.
                </div>
            </div>
            <div className="home--card" onClick={_onClickVault}>
                <div className="home--card-Title home--borderBottom2">Vault</div>
                <div className="home--card-Content">
                    This is your personal file vault which is 100% private, 100% secure and 100% owned by YOU. Every file will be encrypted by a locally-stored encryption key.
                </div>
                {
                    !isPremiumUser && <div className="home--CommingSoon">
                        <div>Get a <span onClick={() => r.push('/user')}>Premium</span></div>
                        to unlock.
                    </div>
                }
            </div>
            <div className="home--card">
                <div className="home--card-Title home--borderBottom3">SecureShare</div>
                <div className="home--card-Content">
                    Your file will be encrypted locally with a unique extraction code before a share link is created. Try this if you’d like to share something private or sensitive to your friends.
                </div>
                <div className="home--CommingSoon">
                    Coming soon...
                </div>
            </div>
        </div>
    </PageUserSideLayout>
}

export const Home = React.memo(styled(home)`
    color: var(--main-color);
    .pusl_center_flex_content {
        width: 76.24rem;
        min-width: unset;
    }
    .home--slog {
        display: inline-block;
        font-size: 3.428571rem;
        font-weight: 600;
        line-height: 4.642857rem;
        margin-top: 5rem;
        a{
            color: var(--primary-color);
        }
    }
    .home--cards {
        .home--card{
        
            cursor: pointer;
            overflow: hidden;
            position: relative;
            background-color: white;
            margin-top: 2.57rem;
            width: 21.7rem;
            height: 21.43rem;
            display: inline-block;
            border-radius: 3.571429rem;
            border: solid 2px #000000;
            padding: 2.285714rem;
            &:nth-child(n + 2){
                margin-left: 2.57rem;
            }
            &:hover{
                filter: drop-shadow(0px 10px 25px rgba(0, 0, 0, 0.2)); 
                .home--CommingSoon{
                    display: flex;
                }
            }
        }
        .home--card-Title {
            display: inline-block;
            font-size: 2.285714rem;
            line-height: 4.285714rem;
            
        }
    
        .home--borderBottom1 {
            border-bottom: 5px solid #92D8F7;
        }
        .home--borderBottom2 {
            border-bottom: 5px solid #A7ECC9;
        }
        .home--borderBottom3 {
            border-bottom: 5px solid #FFD7A6;
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
`)

export default Home