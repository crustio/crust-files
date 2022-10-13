import axios, { AxiosResponse } from 'axios';
import { createUrl } from './share_earn';
import { CommonResponse } from './types';
// import _ from 'lodash';

function getData<T>(res: AxiosResponse<CommonResponse<T>>): T {
    if (res.data.code === 200) return res.data.data
    throw { _type: "CommonResponseError", ...res.data }
}

function getWithAuth<T>(signature: string, path: string) {
    return axios.get<CommonResponse<T>>(createUrl(path), {
        headers: { authorization: `Basic ${signature}` }
    }).then(getData)
}

// get user files
export function getUserFiles(strategy: number, walletType: string, signature: string) {
    return getWithAuth(signature, `/api/files/${strategy}?walletType=${walletType}`)
}