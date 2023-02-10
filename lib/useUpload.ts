import axios, { CancelTokenSource } from 'axios';
import { useMemo, useState } from "react";
import { AuthIpfsEndpoint, AuthIpfsPinner } from "./config";
import { encryptFile } from "./crypto/encryption";
import { readFileAsync } from "./crypto/useUserCrypto";
import { FileInfo, SaveFile, UploadRes } from "./types";
import { getPerfix, WrapLoginUser } from "./wallet/hooks";

export interface Params {
    signature: string,
    msg: string
}
export interface UseUpload {
    upload: (file?: FileInfo) => Promise<[SaveFile, Params]>,
    error: string,
    isBusy: boolean,
    fileSizeError: boolean,
    cancelUp: CancelTokenSource | null,
    upState: { progress: number, up: boolean }
}

const M1 = 1024 * 1024;
const MAX = 40;
const MAX_PREMIUM = 1024;

export interface Options {
    isEncrypt?: boolean,
    secret?: string,
    file?: FileInfo,
    isPremium?: boolean,
    endpoint: AuthIpfsEndpoint,
    pinner: AuthIpfsPinner,
}

export function useUpload(user: WrapLoginUser, options: Options): UseUpload {
    const [error, setError] = useState<string>()
    const [upState, setUpState] = useState({ progress: 0, up: false });
    const [cancelUp, setCancelUp] = useState<CancelTokenSource | null>(null);
    const [isBusy, setBusy] = useState(false);
    const {
        isEncrypt = false,
        secret,
        file,
        isPremium = false,
        endpoint,
        pinner
    } = options
    const mMax = useMemo(() => isPremium ? MAX_PREMIUM : MAX, [isPremium])
    const fileSizeError = useMemo(() => {
        if (!file) return false
        if (file.file) {
            return file.file.size > mMax * M1;
        } else if (file.files) {
            let sum = 0;
            for (const f of file.files) {
                sum += f.size;
            }
            return sum > mMax * M1;
        }
        return false;
    }, [file, mMax]);

    const upload = async (cFile?: FileInfo): Promise<[SaveFile, Params]> => {
        try {
            setError('')
            // 1: sign
            setBusy(true);

            // const prefix = getPerfix(user);
            const msg = user.wallet === 'near' || user.wallet === 'aptos-martian' || user.wallet === 'aptos-petra' ? user.pubKey || '' : user.account;
            // const signature = await user.sign(msg, user.account);
            // const perSignData = user.wallet === 'elrond' ? signature : `${prefix}-${msg}:${signature}`;
            // const base64Signature = window.btoa(perSignData);
            // const AuthBasic = `Basic ${base64Signature}`;
            // const AuthBearer = `Bearer ${base64Signature}`;
            const AuthBasic = `Basic ${user.authBasic}`;
            const AuthBearer = `Bearer ${user.authBearer}`;
            // 2: up file
            const cancel = axios.CancelToken.source();

            setCancelUp(cancel);
            setUpState({ progress: 0, up: true });
            // 2.**** : encrypt
            const form = new FormData();
            const upFile = cFile || file;
            if (isEncrypt) { // encrypt
                if (upFile.file) {
                    const time1 = new Date().getTime()
                    const fileData = await readFileAsync(upFile.file)
                    console.info('readFile::', (new Date().getTime() - time1) / 1000)
                    const encryptedData = await encryptFile(fileData, secret)
                    console.info('encrypted::', (new Date().getTime() - time1) / 1000)
                    const encryptedFile = new Blob([encryptedData], { type: upFile.file.type })
                    form.append('file', encryptedFile, upFile.file.name)
                } else if (upFile.files) {
                    for (const f of upFile.files) {
                        const fileData = await readFileAsync(f)
                        const encryptedData = await encryptFile(fileData, secret)
                        const encryptedFile = new Blob([encryptedData], { type: f.type })
                        form.append('file', encryptedFile, f.webkitRelativePath)
                    }
                }
            } else { // normal
                if (upFile.file) {
                    form.append('file', upFile.file, upFile.file.name);
                } else if (upFile.files) {
                    for (const f of upFile.files) {
                        form.append('file', f, f._webkitRelativePath || f.webkitRelativePath);
                    }
                }
            }

            const UpEndpoint = endpoint.value;
            const upResult = await axios.request<UploadRes | string>({
                cancelToken: cancel.token,
                data: form,
                headers: { Authorization: AuthBasic },
                maxContentLength: mMax,
                method: 'POST',
                onUploadProgress: (p: { loaded: number, total: number }) => {
                    const percent = p.loaded / p.total;

                    setUpState({ progress: Math.round(percent * 99), up: true });
                },
                params: { pin: true },
                url: `${UpEndpoint}/api/v0/add`
            });

            let upRes: UploadRes;

            if (typeof upResult.data === 'string') {
                const jsonStr = upResult.data.replaceAll('}\n{', '},{');
                const items = JSON.parse(`[${jsonStr}]`) as UploadRes[];
                const folder = items.length - 1;

                upRes = items[folder];
                delete items[folder];
                upRes.items = items;
            } else {
                upRes = upResult.data;
            }

            console.info('upResult:', upResult);
            setCancelUp(null);
            setUpState({ progress: 99, up: true })
            // remote pin order
            const PinEndpoint = pinner.value;
            await axios.post(
                `${PinEndpoint}/psa/pins`,
                {
                    cid: upRes.Hash,
                    name: upRes.Name
                },
                {
                    headers: { authorization: AuthBearer },
                }
            );

            setUpState({ progress: 100, up: false });
            const sf: SaveFile = {
                ...upRes,
                PinEndpoint,
                PinTime: new Date().getTime(),
                UpEndpoint,
                Encrypted: isEncrypt,
            }
            const params: Params = {
                msg,
                signature: user.signature
            }
            return [sf, params]
        } catch (e) {
            setUpState({ progress: 0, up: false });
            setBusy(false);
            console.error(e);
            setError('Network Error,Please try to switch a Gateway.');
            throw e
        }
    }

    return {
        upload,
        error: fileSizeError ? `Do not upload files larger than ${mMax}MB!` : error,
        isBusy,
        upState,
        cancelUp,
        fileSizeError
    }
}