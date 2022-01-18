import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Dimmer, Loader, Message, Table, TableProps } from "semantic-ui-react";
import styled from "styled-components";
import { HeadFiles } from "../components/comom/HeadFiles";
import { CenterFlex, ColFlex } from "../components/layout";
import { ColorSpan } from "../components/texts/spans";
import { StyleText } from "../components/texts/texts";
import { useGet } from "../lib/hooks/useGet";
import { getGrandDrawWinners, getRewardsHistory } from "../lib/http/share_earn";
import { RewardsHistory, Winner } from "../lib/http/types";
import _ from 'lodash';
import { shortStr } from "../lib/utils";
import { SubscanAddress, SubscanBlock, SubscanHash } from "../components/texts/links";
import { useToggle } from "../lib/hooks/useToggle";
import { useSafeState } from "../lib/hooks/useSafeState";
import { useApp } from "../lib/AppContext";
import ModalWinner from "../components/modal/ModalWinner";

const space1 = '2.5714rem';
const space2 = '1.1429rem'

const MTable = styled(Table).attrs({ textAlign: 'center', singleLine: true }) <TableProps>`
    border-radius: 0 !important;
`


export default function page() {
    const { query } = useRouter()
    const showMe = query.account
    const doGetData = async (): Promise<RewardsHistory> => {
        return getRewardsHistory(query.account as string)
    }
    const { loading: appLoading, alert } = useApp()
    const [data, , loading] = useGet<RewardsHistory>(() => doGetData())
    const showError = !loading && !data
    const meGrandAmount = useMemo(() => _(data?.grandDraw?.ownerList || []).sumBy(o => _.toNumber(o.amount)), [data])
    const meGrandList: RewardsHistory['grandDraw']['ownerList'] = useMemo(() =>
        _(data?.grandDraw?.ownerList || [])
            .map(o => {
                const gd = _.find(data.grandDraw.drawList, (item) => item.id === o.id)
                gd.winnerCount
                return { ...o, totalAmount: gd.totalAmount, winnerCount: gd.winnerCount }
            })
            .value()
        , [data])

    const [winnersMap, setWinnersMap] = useSafeState<{ [k in number]: Winner[] }>({})
    const [currentId, setCurrentId] = useSafeState<number>(undefined)
    const [showWinners, toggleShowWinners] = useToggle()
    const _onClickWinners = (id: number) => {
        if (winnersMap[id]) {
            setCurrentId(id)
            toggleShowWinners(true)
            return
        }
        appLoading.show()
        getGrandDrawWinners(id)
            .then((v) => {
                setWinnersMap((o) => ({ ...o, [id]: v, currentId: id }))
                setCurrentId(id)
                toggleShowWinners(true)
            })
            .catch(() => alert.error('Network Error'))
            .then(appLoading.hide)
    }
    const showWinnersModal = showWinners && currentId
    return <ColFlex>
        {
            showWinnersModal && <ModalWinner
                size={'large'}
                open={true}
                toggleOpen={toggleShowWinners}
                winners={winnersMap[currentId]}
            />
        }
        <HeadFiles />
        <CenterFlex style={{ width: '100%' }}>
            <ColFlex style={{ width: '100%', maxWidth: '90rem', paddingBottom: '8rem', color: 'black', position: 'relative' }}>
                {
                    loading && <Dimmer active={true} inverted style={{ marginTop: '4rem' }}>
                        <Loader size="large" inverted />
                    </Dimmer>}
                {
                    showError && <Message color="red" style={{ marginTop: '4rem' }}>
                        <Message.Content>Network Error, Please Check Network.</Message.Content>
                    </Message>
                }
                {
                    data && <>
                        <StyleText style={{ marginTop: '2.1429rem' }} className="style1" children="User Rewards Program" />
                        <StyleText className="style2" children="Historical Data Record" style={{ marginBottom: '8px' }} />
                        {/* Invite Bonus */}
                        <StyleText className="style3" style={{ marginTop: space1, marginBottom: space2 }}>
                            Invite Bonus {showMe && <>(My bonus: <ColorSpan color="--primary-color3">{data.invite.amount}</ColorSpan> CRU)</>}
                        </StyleText>
                        <StyleText className="style6">
                            Total bonus distributed: <ColorSpan color="--primary-color3">{data.invite.totalAmount}</ColorSpan> CRU<br />
                            {showMe && <>My successful invitations: <ColorSpan color="--primary-color3">{data.invite.inviteCount}</ColorSpan><br /></>}
                            Current bonus per invitation: <ColorSpan color="--primary-color3">{_.toNumber(data.invite.currentInvitation)}</ColorSpan> CRU
                        </StyleText>


                        {/* Lucky Newbie */}
                        <StyleText className="style3" style={{ marginTop: space1, marginBottom: space2 }}>
                            Lucky Newbie {showMe && <>(My prize: <ColorSpan color="--primary-color3">{data.newbie.amount}</ColorSpan> CRU)</>}
                        </StyleText>
                        <StyleText className="style6">
                            Total prize distributed: <ColorSpan color="--primary-color3">{data.newbie.totalAmount}</ColorSpan> CRU<br />
                            Historical prize winners
                        </StyleText>
                        <MTable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>No.</Table.HeaderCell>
                                    <Table.HeaderCell>Account</Table.HeaderCell>
                                    <Table.HeaderCell>Block</Table.HeaderCell>
                                    <Table.HeaderCell>Prize Won</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    data.newbie.claimList.map((v, i) => <Table.Row key={`lucky_${i}`}>
                                        <Table.Cell>{i + 1}</Table.Cell>
                                        <Table.Cell><SubscanAddress account={v.address}>{shortStr(v.address, 10)}</SubscanAddress></Table.Cell>
                                        <Table.Cell><SubscanBlock block={v.blockNumber}>#{v.blockNumber}</SubscanBlock></Table.Cell>
                                        <Table.Cell>{_.toNumber(v.totalAmount)} CRU</Table.Cell>
                                    </Table.Row>)
                                }
                            </Table.Body>
                        </MTable>


                        {/* Grand Draw */}
                        <StyleText className="style3" style={{ marginTop: space1, marginBottom: space2 }}>
                            Grand Draw {showMe && <>(My prize: <ColorSpan color="--primary-color3">{meGrandAmount}</ColorSpan> CRU)</>}
                        </StyleText>
                        <StyleText className="style6">
                            Total prize distributed: <ColorSpan color="--primary-color3">{_.toNumber(data.grandDraw.totalAmount)}</ColorSpan> CRU<br />
                            Draw history
                        </StyleText>
                        <MTable >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>No.</Table.HeaderCell>
                                    <Table.HeaderCell>Prize</Table.HeaderCell>
                                    <Table.HeaderCell>Draw Block</Table.HeaderCell>
                                    <Table.HeaderCell>Block Hash</Table.HeaderCell>
                                    <Table.HeaderCell>Winning Condition</Table.HeaderCell>
                                    <Table.HeaderCell>Winning Accounts</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    data.grandDraw.drawList.map((v, i) => <Table.Row key={`lucky_${i}`}>
                                        <Table.Cell>{i + 1}</Table.Cell>
                                        <Table.Cell>{_.toNumber(v.totalAmount)} CRU</Table.Cell>
                                        <Table.Cell><SubscanBlock block={v.blockNumber}>#{v.blockNumber}</SubscanBlock></Table.Cell>
                                        <Table.Cell><SubscanBlock block={v.blockHash}>{`...${v.blockHash.substring(v.blockHash.length - _.toNumber(v.matchCount))}`}</SubscanBlock></Table.Cell>
                                        <Table.Cell>{`last ${_.toNumber(v.matchCount)} digits match`}</Table.Cell>
                                        <Table.Cell
                                            onClick={() => _onClickWinners(v.id)}
                                            style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                            {`${_.toNumber(v.winnerCount)} check full list`}
                                        </Table.Cell>
                                    </Table.Row>)
                                }
                            </Table.Body>
                        </MTable>
                        <StyleText className="style6">
                            {
                                meGrandList.length > 0 ? <>My prize</>
                                    : <>{`My prize: You haven't got any prize yet.`}</>
                            }
                        </StyleText>
                        {meGrandList.length > 0 && <MTable >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>No.</Table.HeaderCell>
                                    <Table.HeaderCell>Prize</Table.HeaderCell>
                                    <Table.HeaderCell>Winning Accounts</Table.HeaderCell>
                                    <Table.HeaderCell>Prize per Winner</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    meGrandList.map((v, i) => <Table.Row key={`lucky_${i}`}>
                                        <Table.Cell>{i + 1}</Table.Cell>
                                        <Table.Cell>{_.toNumber(v.totalAmount)} CRU</Table.Cell>
                                        <Table.Cell>{_.toNumber(v.winnerCount)}</Table.Cell>
                                        <Table.Cell>{_.toNumber(v.amount)} CRU</Table.Cell>
                                    </Table.Row>)
                                }
                            </Table.Body>
                        </MTable>}

                        {/* Claim Rewards */}
                        {showMe && <>
                            <StyleText className="style3" style={{ marginTop: space1, marginBottom: space2 }}>
                                Claim Rewards
                            </StyleText>
                            <StyleText className="style6">
                                Total rewards claimed by me: <ColorSpan color="--primary-color3">{_.toNumber(data.claimRewards.totalAmount)}</ColorSpan> CRU<br />
                                {
                                    data.claimRewards.claimList.length > 0 ? <>My Historical claims</>
                                        : <>My historical claims: No claim history.</>
                                }
                            </StyleText>
                            {data.claimRewards.claimList.length > 0 && <MTable >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>No.</Table.HeaderCell>
                                        <Table.HeaderCell>Tx ID</Table.HeaderCell>
                                        <Table.HeaderCell>Rewards Claimed</Table.HeaderCell>

                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {
                                        data.claimRewards.claimList.map((v, i) => <Table.Row key={`lucky_${i}`}>
                                            <Table.Cell>{i + 1}</Table.Cell>
                                            <Table.Cell> <SubscanHash hash={v.txHash}>{shortStr(v.txHash)}</SubscanHash> </Table.Cell>
                                            <Table.Cell>{_.toNumber(v.totalAmount)} CRU</Table.Cell>
                                        </Table.Row>)
                                    }
                                </Table.Body>
                            </MTable>}
                        </>}
                    </>}

            </ColFlex>
        </CenterFlex>
    </ColFlex>
}