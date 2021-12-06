import axios, { CancelTokenSource } from 'axios';
import classNames from "classnames";
import _ from 'lodash';
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useApp } from "../lib/AppContext";
import { useContextWrapLoginUser } from "../lib/wallet/hooks";
import { BaseProps } from "./types";


function _GetNickname(props: BaseProps) {
    const { className } = props

    const { loading } = useApp()
    const wUser = useContextWrapLoginUser()
    useEffect(() => {
        if (wUser.account && wUser.wallet === 'crust') {
            loading.show()
            // check register
            wUser.setNickName('123')
            loading.hide()
        }
    }, [wUser.account, wUser.wallet, loading])

    const [nickName, setNickName] = useState("")
    const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNickName(e.target.value)
    }
    const _onClickContinue = () => {
        if (nickStat !== 1) return
        wUser.setNickName(nickName)
    }
    //check nickname  (0: init)(-1: false)(1: true)
    const [nickStat, setNickStat] = useState(0)
    const [errorInfo, setErrorInfo] = useState('')

    const doCheckNickName = useMemo(() => {
        let task: CancelTokenSource = null
        return _.debounce((nickName: string) => {
            if (task) task.cancel
            task = axios.CancelToken.source()
            if (nickName === "123") {
                setNickStat(1)
            }
            if (nickName === "1") {
                setNickStat(-1)
                setErrorInfo('This name is occupied, try another one.')
            }
        }, 300)
    }, [])

    useEffect(() => {
        setErrorInfo('')
        if (nickName) doCheckNickName(nickName)
    }, [nickName])
    const showGetNickname = wUser.account && wUser.wallet === 'crust' && !wUser.nickName
    if (!showGetNickname) return null
    return <div className={className} onClick={() => { }}>
        <img className="logo" src="/images/logo_12x.png" />
        <div className="flex1" />
        <span className="title">Get a Nickname first</span>
        <span className="sub-info">This Nickname is unique, linked to your Crust Account, and cannot be changed afterwards. Get a nice one!</span>
        <div className="input-panel">
            <input
                type={'text'}
                value={nickName}
                onChange={_onChange}
                maxLength={10}
                placeholder={"Enter your desired Nickname"}
            />
            {
                nickStat !== 0 && <span
                    className={classNames("nick-stat", {
                        "cru-fo-check-circle": nickStat === 1,
                        "success": nickStat === 1,
                        "cru-fo-x-circle": nickStat === -1,
                        "error": nickStat === -1
                    })}
                />}
            <span className={classNames("btn-continue", { enabled: nickStat === 1 })} onClick={_onClickContinue}>Continue</span>
        </div>
        <div className="error-info"> {errorInfo}</div>
        <div className="flex1" />
    </div>
}

export const GetNickname = React.memo<BaseProps>(styled(_GetNickname)`
    position: absolute;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo {
        align-self: flex-start;
        height: 35px;
        width: auto;
        margin: 35px 50px;
    }
    .title {
        font-size: 2.285714rem;
        font-weight: 600;
        line-height: 3.142857rem;
        margin-bottom: 1.142857rem
    }
    .sub-info {
        color: var(--secend-color);
        font-size: 1.285714rem;
        line-height: 1.785714rem;
        margin-bottom: 1.142857rem;
    }
    .input-panel {
        display: inline-block;
        overflow: hidden;
        border: 1px solid #999999;
        border-radius: .857143rem;
        height: 4.285714rem;
        font-size: 1.142857rem;
        position: relative;
        input {
            display: inline-block;
            border: unset;
            outline: unset;
            height: 100%;
            line-height: 4.285714rem;
            width: 28.857143rem;
            padding-left: 1.14rem;
            padding-right: 4.285714rem;
            overflow: hidden;
        }
        .btn-continue {
            display: inline-block;
            cursor: pointer;
            height: 100%;
            vertical-align: top;
            line-height: 4.285714rem;
            width: 11.428571rem;
            text-align: center;
            color: white;
            background-color: #999999;
            &.enabled{
                background-color: var(--primary-color);
            }
        }
        .nick-stat {
           line-height : 4.285714rem;
           position: absolute;
           height: 100%;
           width: 20px;
           top: 0;
           right: 12.857143rem;
           &.success {
               color: #56CB8F;
           }
           &.error {
               color: #f37565;
           }
        }

       
    }
    .error-info {
        line-height: 19px;
        height: 19px;
        color: #f37565;
        width: 40.285714rem;
        padding-left: 1.14rem;
        margin-top: 16px;
        text-align: left;
    }
`)