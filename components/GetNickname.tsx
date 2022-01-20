import axios, { CancelTokenSource } from 'axios';
import classNames from "classnames";
import _ from 'lodash';
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useApp } from "../lib/AppContext";
import { report } from '../lib/http/report';
import { checkNickName, getMemberByAccount, getNickNameByAccount, setMyNickName } from '../lib/http/share_earn';
import { getErrorMsg } from '../lib/utils';
import { useContextWrapLoginUser } from "../lib/wallet/hooks";
import { BaseProps } from "./types";
import User from './User';
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

function _GetNickname(props: BaseProps) {
    const { className } = props

    const { loading, recaptcha } = useApp()
    const wUser = useContextWrapLoginUser()
    const { account, wallet, member } = wUser
    useEffect(() => {
        wUser.setNickName('')
        wUser.setMember(undefined)
        if (account && wallet === 'crust') {
            loading.show()
            getMemberByAccount(account)
                .then(wUser.setMember)
                .catch(console.error)
                .then(() => getNickNameByAccount(account))
                .then(name => wUser.setNickName(name))
                .catch(console.error)
                .then(loading.hide)
        }
    }, [account, wallet])

    const [nickName, setNickName] = useState("")
    const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNickName(e.target.value)
    }
    const _onClickContinue = async () => {
        setErrorInfo('')
        if (nickStat !== 1) return
        try {
            const msg = wUser.account
            const signature = await wUser.sign(msg, wUser.account)
            const perSignData = `crust-${msg}:${signature}`;
            const base64Signature = window.btoa(perSignData)
            const token = await recaptcha.getToken()
            if (!token) return
            loading.show()
            // console.info('sign:', base64Signature)
            // console.info('totke:', token)
            const member = await setMyNickName(nickName, token, base64Signature)
            wUser.setMember(member)
            wUser.setNickName(member.nick_name)
            report({
                type: 1,
                walletType: wUser.wallet,
                address: wUser.account,
                data: {}
            })
            setNickName("")
            loading.hide()
        } catch (e) {
            setErrorInfo(getErrorMsg(e))
            loading.hide()
        }
    }
    //check nickname  (0: init)(-1: false)(1: true)
    const [nickStat, setNickStat] = useState(0)
    const [errorInfo, setErrorInfo] = useState('')

    const doCheckNickName = useMemo(() => {
        let task: CancelTokenSource = null
        return _.debounce((nickName: string) => {
            setErrorInfo(() => '')
            setNickStat(0)
            if (!nickName) {
                return
            }
            const length = nickName.length
            if (length < 3 || length > 15) {
                setNickStat(-1)
                setErrorInfo('Nickname should be 3-15 length.')
                return
            }
            const nickMatch = nickName.match('[^a-z0-9)]')
            if (nickMatch) {
                setNickStat(-1)
                setErrorInfo("Only lower case letters and numbers are allowed!")
                return
            }
            try {
                if (task) task.cancel()
            } catch (error) {
                console.info(error)
            }
            task = axios.CancelToken.source()
            checkNickName(nickName, { cancelToken: task.token })
                .then(valid => {
                    setNickStat(valid ? 1 : -1)
                    setErrorInfo(valid ? '' : 'This name is occupied!')
                })
        }, 600)
    }, [])

    useEffect(() => {
        setErrorInfo(() => '')
        setNickStat(0)
        if (nickName) doCheckNickName(nickName)
    }, [nickName])

    const showGetNickname = _.isEmpty(member) && account && wallet === 'crust' && !wUser.nickName
    if (!showGetNickname) return null
    if (loading.isLoading) return <div className={className} />
    return <div className={className}>
        <div className="flex">
            <img className="logo" src="/images/logo_12x.png" />
            <User className="get_nickname_User" />
        </div>
        <div className="flex1" />
        <span className="title">Get a Nickname first</span>
        <span className="sub-info">This Nickname is unique, linked to your Crust Account, and cannot be changed afterwards. Get a nice one!</span>
        <div className="input-panel">
            <input
                spellCheck="false"
                type={'text'}
                value={nickName}
                onChange={_onChange}
                maxLength={15}
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
        <div className="error-info">{errorInfo}</div>
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
    .flex {
        display: flex;
        width: 100%;
        justify-content: space-between;
        .get_nickname_User {
            flex: 1;
            width: 0;
            border-bottom: unset !important;
        }
    }
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