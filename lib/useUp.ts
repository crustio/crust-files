import axios, { CancelTokenSource } from "axios";
import { useMemo, useState } from "react";
import { AuthIpfsEndpoint } from "./config";
import { FileInfo, SaveFile, UploadRes } from "./types";
import { getErrorMsg } from "./utils";

export interface Params {
  signature: string;
  msg: string;
}
export interface UseUpload {
  upload: (file?: FileInfo) => Promise<SaveFile>;
  error: string;
  isBusy: boolean;
  fileSizeError: boolean;
  cancelUp: CancelTokenSource | null;
  upState: { progress: number; up: boolean };
}

const M1 = 1024 * 1024;
const MAX = 40;
export interface Options {
  file?: FileInfo;
  endpoint: AuthIpfsEndpoint;
}

export function useUpFile(options: Options): UseUpload {
  const [error, setError] = useState<string>();
  const [upState, setUpState] = useState({ progress: 0, up: false });
  const [cancelUp, setCancelUp] = useState<CancelTokenSource | null>(null);
  const [isBusy, setBusy] = useState(false);
  const {
    file,

    endpoint,
  } = options;
  const mMax = useMemo(() => MAX, []);
  const fileSizeError = useMemo(() => {
    if (!file) return false;
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

  const upload = async (cFile?: FileInfo): Promise<SaveFile> => {
    try {
      setError("");
      // 1: sign
      setBusy(true);
      const AuthBasic = `Basic ${"ZXRoLTB4ZmUxOGFhMWVmYTY1MjY2MGYzNmFiODRmMTIyY2QzNjEwOGY5MDNiNjoweDFkZmY1MTM4MDdkNDZmZTE0MDUwZGFlMWJjMzQ5ODVjOTAyNDg4ZmE3MzM4ZDYyNTdmYTUzZGQ2OGJmMGRkNTg3OTI5MmU2NDk4OGViNjhiYTliNzFhOTc0YWUyZDRlMzYyOWY1ZTM3YzZlNTIxYzY2MjIwZGYzZTNlNTY3NTAzMWM"}`;
      // 2: up file
      const cancel = axios.CancelToken.source();

      setCancelUp(cancel);
      setUpState({ progress: 0, up: true });
      // 2.**** : encrypt
      const form = new FormData();
      const upFile = cFile || file;

      if (upFile.file) {
        form.append("file", upFile.file, upFile.file.name);
      } else if (upFile.files) {
        for (const f of upFile.files) {
          form.append("file", f, f._webkitRelativePath || f.webkitRelativePath);
        }
      }
      const UpEndpoint = endpoint.value;
      const upResult = await axios.request<UploadRes | string>({
        cancelToken: cancel.token,
        data: form,
        headers: { Authorization: AuthBasic },
        maxContentLength: mMax,
        method: "POST",
        onUploadProgress: (p: { loaded: number; total: number }) => {
          const percent = p.loaded / p.total;

          setUpState({ progress: Math.round(percent * 99), up: true });
        },
        params: { pin: true, "cid-version": 1, hash: "sha2-256" },
        url: `${UpEndpoint}/api/v0/add`,
      });

      let upRes: UploadRes;

      if (typeof upResult.data === "string") {
        const jsonStr = upResult.data.replaceAll("}\n{", "},{");
        const items = JSON.parse(`[${jsonStr}]`) as UploadRes[];
        const folder = items.length - 1;

        upRes = items[folder];
        delete items[folder];
        upRes.items = items;
      } else {
        upRes = upResult.data;
      }

      console.info("upResult:", upResult);
      setCancelUp(null);
      setUpState({ progress: 99, up: true });
      // remote pin order

      setUpState({ progress: 100, up: false });
      const sf: SaveFile = {
        ...upRes,
        PinTime: 0,
        UpEndpoint,
      };
      return sf;
    } catch (e) {
      setUpState({ progress: 0, up: false });
      setBusy(false);
      console.error(e);
      if (e?.data?.code === -32000) {
        setError("Insufficient Wallet Balance!");
        return;
      }
      if (e?.code === "ACTION_REJECTED") {
        setError("User has rejected the operation.");
        return;
      }
      setError(getErrorMsg(e));
      // setError('Network Error,Please try to switch a Gateway.');
      throw e;
    }
  };

  return {
    upload,
    error: fileSizeError ? `Do not upload files larger than ${mMax}MB!` : error,
    isBusy,
    upState,
    cancelUp,
    fileSizeError,
  };
}
