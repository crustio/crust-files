import { isValidAddress } from "ethereumjs-util";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useApp } from "../lib/AppContext";
import { ShareEarnENV } from "../lib/config";
import { useGet } from "../lib/hooks/useGet";
import { useGetDepost } from "../lib/hooks/useGetDeposit";
import { useSafeState } from "../lib/hooks/useSafeState";
import { getBindEXAddress } from "../lib/http/share_earn";
import { BindAddress } from "../lib/http/types";
import { getErrorMsg } from "../lib/utils";
import { finalTxSignAndSend, sleep } from "../lib/wallet/tools";
import Btn from "./Btn";
import { MCard } from "./MCard";
import MDropdown from "./MDropdown";
import { BaseProps } from "./types";


const BindTypeDropdown = styled(MDropdown)`
    &.mdropdown {
      display: inline-block;
      vertical-align: top;
      width: 130px !important;
      border-radius: 8px !important;
      border: 1px solid #999999 !important;
      margin-right: 8px !important;
      line-height: 40px;
      height: 40px;
      padding: 0 30px 0 14px;
      .text {
        white-space: nowrap;
        font-size: 14px !important;
        line-height: 40px !important;
        font-weight: 500 !important;
        color: var(--main-color) !important;
        font-family: OpenSans-Medium sans-serif !important;
      }
      .dropIcon {
        position: absolute;
        right: 11px;
        top: 12px;
      }

      .options {
        .item {
          line-height: 24px;
          padding: 4px 20px;
        }
      }
    }
`

type BindAddressType = 'eth' | 'polygon' | 'bsc'
const BindAddressTypes: BindAddressType[] = ['eth', 'polygon', 'bsc']
const OptionsMap: { [k in BindAddressType]: { text: string, value: BindAddressType } } = {
    'eth': { value: 'eth', text: 'ETH' },
    'polygon': { value: 'polygon', text: 'Polygon' },
    'bsc': { value: 'bsc', text: 'BSC (BEP20)' },
}

const ChainTypeMap: { [k in number]: string } = {
    0: 'ETH',
    1: 'BSC',
    2: 'Polygon'
}

export type Props = BaseProps


function _BindAirdrop(props: Props) {
    const { className } = props
    const { loading, api, alert } = useApp()
    const { isPremiumUser, user } = useGetDepost()
    const [oldEX, doGetBinded] = useGet(() => getBindEXAddress(user.account), [user.account, isPremiumUser])
    const oldExList: BindAddress[] = oldEX || []
    const [exAddress, setEXAddress] = useSafeState<string>('')
    const [exAddressError, setEXAddressError] = useSafeState('')
    const disableBindEth = !isPremiumUser || !!exAddressError;
    const typeOptions = useMemo(() => BindAddressTypes.map(item => OptionsMap[item]), [])
    const [type, setType] = useState<BindAddressType>(BindAddressTypes[0])
    const _onTypeChange = useCallback((_, { value }) => {
        setType(value)
    }, [])
    const _onChangeEthAddress = (e) => {
        setEXAddress(e.target.value)
        const isValid = isValidAddress(e.target.value)
        setEXAddressError(isValid ? '' : 'Check Input')
    }
    const _onClickBindEth = async () => {
        if (!isPremiumUser) return
        if (!exAddress) return
        try {
            loading.show()
            api.setSigner({ ...user.crust.wallet.signer })
            const remark = api.tx.system.remark(JSON.stringify({
                "scope": "crustFiles",
                "env": ShareEarnENV,
                "action": "bindExternalAddress",
                "externalAddressType": type,
                "externalAddress": exAddress
            }))
            await finalTxSignAndSend(remark, user.account)
            api.setSigner(undefined)
            for (let i = 1; i <= 3; i++) {
                await sleep(3000)
                const data = await doGetBinded()
                if (data) break
            }
            loading.hide()
        } catch (error) {
            loading.hide()
            const msg = getErrorMsg(error)
            if (msg.includes('account balance too low')) {
                alert.warnModal('Insufficient Funds!')
            } else {
                alert.error(msg)
            }
        }
    }
    return <MCard className={className}>
        <div className="title font-sans-semibold">
            {'Bind AirDrop Addresses'}
        </div>
        <div className="text font-sans-regular">
            Bind your addresses from multi blockchain platforms for potential airdrops. You can submit amandments when you have updates on your addresses.<br />
            <br />
            {
                oldExList.map((item, index) => <div key={`old_ex_${index}`}>
                    Your binded {ChainTypeMap[item.chain_type]} address: <span className='bold-text font-sans-semibold'>{item.address}</span>
                </div>)
            }
            <br />
        </div>
        {
            <>
                <BindTypeDropdown
                    selection
                    icon={<span className="icon cru-fo cru-fo-chevron-down" />}
                    defaultValue={BindAddressTypes[0]}
                    options={typeOptions}
                    onChange={_onTypeChange}
                />
                <input
                    disabled={!isPremiumUser}
                    className="input-eth"
                    spellCheck="false"
                    value={exAddress}
                    // placeholder="Enter inviter’s Nickname（Leave blank if you have no inviter.）"
                    onChange={_onChangeEthAddress} />
                {exAddressError && <span className="input-EthError">{exAddressError}</span>}
                <br />
                <Btn disabled={disableBindEth} className='btn' style={{ width: 544, height: 40 }} onClick={_onClickBindEth}>Submit</Btn>
                {!isPremiumUser && <span className='submit-tip'>Get Premium User to bind your AirDrop addresses.</span>}
            </>}
    </MCard>
}

export const BindAirdrop = styled(_BindAirdrop)`
.input-eth {
    vertical-align: top;
    display: inline-block;
    min-width: 406px;
    margin-bottom: 12px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #999999;
    font-family: OpenSans-Regular;
    outline: unset;
    border-radius: 8px;
    padding-left: 16px;
    padding-right: 16px;
    font-size: 10px;
    &::placeholder{
      color: #999999;
    }
  }
  .input-EthError {
    font-size: 10px;
    color: #F37565;
    margin-left: 12px;
  }
  .submit-tip {
    margin-left: 12px;
    font-size: 10px;
    color: var(--secend-color);
  }
`