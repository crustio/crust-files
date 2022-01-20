import HCaptcha from '@hcaptcha/react-hcaptcha';
import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import styled from "styled-components";
import { useApp } from "../../lib/AppContext";
import { RecaptchKey } from '../../lib/config';
import Btn from '../Btn';
import { BaseProps } from "../types";

export type Props = BaseProps

function _ReCaptcha(props: Props) {
    const { recaptcha, alert } = useApp()
    const { _onChange, _onExpired, _onLoaded, loadingScript, showReCaptcha } = recaptcha
    const _onErrored = (error: string) => {
        alert.error(error)
    }
    const _onCancel = () => { _onChange('') }
    return <>
        {
            showReCaptcha && <div
                className={props.className}
                style={{
                    display: 'flex',
                    position: 'fixed',
                    zIndex: 100000,
                    background: 'rgba(0,0,0,0.4)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    left: 0,
                    top: 0,
                    width: '100vw',
                    height: '100vh'
                }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#ffffff',
                    borderRadius: 20,
                    width: 500,
                    height: 300,
                }}>
                    {
                        loadingScript && <Dimmer active={true} inverted style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh' }}>
                            <Loader size='large' inverted content={'Loading'} />
                        </Dimmer>
                    }
                    {
                        <HCaptcha
                            languageOverride="en"
                            // size='compact'
                            sitekey={RecaptchKey}
                            onLoad={_onLoaded}
                            onVerify={_onChange}
                            onError={_onErrored}
                            onExpire={_onExpired}
                        />
                    }
                    <div style={{ height: 40 }} />
                    <Btn content="Cancel" onClick={_onCancel} />
                </div>
            </div>
        }
    </>
}

export const ReCaptcha = styled(_ReCaptcha) <Props>`
    background-color: black;
    .rc-frame {

    }
`
