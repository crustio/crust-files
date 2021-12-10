import React from 'react';
import { BaseProps } from '../components/types';
import styled from 'styled-components';
import SideLayout from '../components/SideLayout';
import { Segment } from 'semantic-ui-react';
import User from '../components/User';
import { useRouter } from 'next/router';
import { useGetDepost } from '../lib/hooks/useGetDeposit';

function home(p: BaseProps) {
    const r = useRouter()
    const { isPremiumUser } = useGetDepost()
    const _onClickPublick = () => r.push('/files')
    const _onClickVault = () => isPremiumUser && r.push('/files/vault')

    return <SideLayout path='/home'>
        <User />
        <Segment basic className={p.className}>
            <Segment basic className={'home--content'}>
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
                                Comming soon...
                            </div>
                        }
                    </div>
                    <div className="home--card">
                        <div className="home--card-Title home--borderBottom3">SecureShare</div>
                        <div className="home--card-Content">
                            Your file will be encrypted locally with a unique extraction code before a share link is created. Try this if you’d like to share something private or sensitive to your friends.
                        </div>
                        <div className="home--CommingSoon">
                            Comming soon...
                        </div>
                    </div>
                </div>
            </Segment>
        </Segment>
    </SideLayout>
}

export const Home = React.memo(styled(home)`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--main-color);
    .home--content{
        padding: unset;
        max-width: 984px;
        .home--slog {
            font-size: 3.428571rem;
            font-weight: 600;
            line-height: 4.642857rem;
            margin-top: 6.857143rem;
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
                margin-top: 2.571429rem;
                width: 21.714286rem;
                height: 21.428571rem;
                display: inline-block;
                border-radius: 3.571429rem;
                border: solid 2px #000000;
                padding: 2.285714rem;
                &:nth-child(n + 2){
                    margin-left: 2.571429rem;
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
                background-color: white;
                width: 100%;
                height: 100%;
                justify-content: center;
                align-items: center;
                text-align: center;
                font-size: 2.285714rem;
                white-space: nowrap;
            }
        }
    }
`)

export default Home