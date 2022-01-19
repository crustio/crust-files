// Copyright 2017-2021 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import _ from 'lodash';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Modal, Progress, Radio } from 'semantic-ui-react';
import styled from "styled-components";
import { WrapUserCrypto } from "../../lib/crypto/useUserCrypto";
import { useToggle } from "../../lib/hooks/useToggle";
import { report } from '../../lib/http/report';
import { useAuthGateway, useAuthPinner } from '../../lib/useAuth';
import { useUpload } from '../../lib/useUpload';
import { WrapLoginUser } from '../../lib/wallet/hooks';
import { FileInfo, SaveFile } from '../../lib/wallet/types';
import Btn from "../Btn";
import MDropdown from "../MDropdown";


const Contribute = styled.div`
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  color: var(--primary-color);
  text-align: center;
`
export interface Props {
  className?: string,
  file: FileInfo,
  onClose?: () => void,
  onSuccess?: (res: SaveFile) => void,
  user: WrapLoginUser,
  uc: WrapUserCrypto,
  type: 'public' | 'vault',
  isPremium?: boolean,
}

const NOOP = (): void => undefined;

function UploadModal(p: Props): React.ReactElement<Props> {
  const { className, uc, file, onClose = NOOP, onSuccess = NOOP, user, type, isPremium } = p;
  const isVault = type === 'vault'
  const { t } = useTranslation();
  const { endpoint, endpoints, onChangeEndpoint } = useAuthGateway();
  const { onChangePinner, pinner, pins } = useAuthPinner();
  const encrypt = isVault && !!uc.secret;
  const [showOptions, toggleShowOptions] = useToggle()
  const { error, cancelUp, upState, upload, isBusy, fileSizeError } = useUpload(user, {
    isEncrypt: !!encrypt,
    secret: uc.secret,
    file,
    isPremium,
    endpoint,
    pinner,
  })
  const _onClickContributeGateway = () => window.open('https://wiki.crust.network/docs/en/buildIPFSWeb3AuthGW', '_blank')
  const _onClickContributePinner = () => window.open('https://wiki.crust.network/docs/en/buildIPFSW3AuthPin', '_blank')

  const _onClose = useCallback(() => {
    if (cancelUp) cancelUp.cancel();
    onClose();
  }, [cancelUp, onClose]);

  const disabledSingAndUpload = fileSizeError || (isVault && !uc.secret) || !user.account || !user.sign
  const _onClickUp = () => {
    if (disabledSingAndUpload) {
      return;
    }
    upload()
      .then(([saveFile]) => {
        onSuccess(saveFile)
        return report({
          type: 2,
          walletType: user.wallet,
          address: user.account,
          data: {
            cid: saveFile.Hash,
            fileType: _.size(saveFile.items) ? 1 : 0,
            strategy: saveFile.Encrypted ? 1 : 0,
          }
        })
      }).catch(console.error)
  }

  return (
    <Modal
      closeIcon={<span className="close icon cru-fo-x" />}
      onClose={_onClose}
      open={true}
      size={'large'}
      className={className}
    >
      <Modal.Header
        className="font-sans-semisold">{t<string>(file.dir ? 'Upload Folder' : 'Upload File')}</Modal.Header>
      <Modal.Content>
        <Card.Group>
          <Card fluid>
            <Card.Content>
              <Card.Header content={file.dir ? 'Folder' : 'File'} />
              <Card.Description
                content={file.dir ?
                  `${file.dir} (${file.files.length} files)` :
                  `${file.file.name} (${file.file.size} bytes)`
                }
              />
            </Card.Content>
          </Card>
          {
            showOptions && <>
              <Card fluid>
                <MDropdown
                  fluid
                  selection
                  className="clear-border"
                  help={t<string>('File streaming and wallet authentication will be processed by the chosen gateway.')}
                  disabled={isBusy}
                  label={t<string>('Select a Web3 IPFS Gateway')}
                  onChange={onChangeEndpoint}
                  options={endpoints}
                  defaultGroup={endpoint.group}
                  defaultValue={endpoint.value}
                  footer={<Contribute onClick={_onClickContributeGateway}>Contribute IPFS W3Auth Gateway</Contribute>}
                />
              </Card>
              <Card fluid>
                <MDropdown
                  fluid
                  selection
                  className="clear-border"
                  help={t<string>('Your file will be pinned to IPFS for long-term storage.')}
                  disabled={pins.length === 0}
                  label={t<string>('Select a Web3 IPFS Pinner')}
                  onChange={onChangePinner}
                  options={pins}
                  defaultValue={pinner.value}
                  footer={<Contribute onClick={_onClickContributePinner}>Contribute IPFS W3Auth Pinner</Contribute>}
                />
              </Card>
            </>
          }
          {
            file.file && <Card fluid className="encryption">
              <Card.Content>
                <Card.Header content={"File Encryption"} />
                {
                  uc.secret ? <Card.Description content={encrypt ? 'Yes' : 'File encryption is disabled in Public Mode.'} /> :
                    <Card.Description
                      content={"Please go to the 'Setting' page and set encryption key before activating this function."}
                    />
                }
                <Radio toggle defaultChecked={encrypt} disabled={true} />
              </Card.Content>
            </Card>
          }
          {!showOptions && <div className="toggle-options" onClick={() => toggleShowOptions()}>{showOptions ? 'Put Away' : 'More Settings'}{<span className='cru-fo cru-fo-chevron-down'></span>}</div>}
        </Card.Group>
        {
          error &&
          <div
            style={{
              color: 'orangered',
              padding: '1rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}
          >
            {error}
          </div>
        }
      </Modal.Content>
      <Modal.Actions>
        <div className={'uploading'}>
          {upState.up && <Progress
            value={upState.progress}
            total={100}
            active
            color={"orange"}
          />}
          {upState.up && <Btn onClick={_onClose}>{t('Cancel')}</Btn>}
          {!upState.up && <Btn fluid onClick={_onClickUp} disabled={disabledSingAndUpload}>{t('Sign and Upload')}</Btn>}
        </div>
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo<Props>(styled(UploadModal)`
  width: 51.43rem !important;

  .header:nth-child(2) {
    height: 3.93rem;
    font-size: 1.3rem !important;
    padding: 0 1.14rem !important;
    font-weight: 600 !important;
    line-height: 3.93rem !important;
  }


  .close.icon {
    top: 0.5rem;
    right: 0.6rem;
    color: #666666;
  }

  .content {
    padding: 1rem !important;
  }

  .ui.cards > .card {
    margin: 0.5rem !important;

    .content > .header {
      font-size: 1rem;
      font-weight: unset !important;
      color: var(--main-color);
      font-weight: 600;
      font-family: OpenSans-SemiBold;
    }

    .content > .description {
      font-size: 1rem;
      color: #999999;
      font-family: OpenSans-Regular;
    }
  }

  .ui.cards > .card:first-child {
    margin-top: 1rem !important;
  }

  .toggle-options {
    cursor: pointer;
    font-size: 10px;
    color: #999999;
    line-height: 14px;
    margin-top: 8px;
    margin-left: 1.51rem;
    .cru-fo {
      font-size: 14px;
      position: relative;
      top: 2px;
      margin-left: 6px;
    }
  }

  .actions {
    height: 4.8rem;
    padding: 0.5rem 1rem 0 1rem !important;
    border-top: unset !important;
    background: unset !important;

    .button {
      margin-left: unset !important;
    }
  }

  .uploading {
    height: 4rem;
    display: flex;
    align-items: center;

    .progress {
      margin: 0 1rem 0 0 !important;
      vertical-align: baseline;
      background: unset !important;
      border: 1px solid orange;
      flex: 1;

      .bar {
        min-width: unset !important;
        height: 2.5rem;
      }
    }
  }

  .card.encryption {
    position: relative;

    .toggle {
      position: absolute;
      top: calc(50% - 0.75rem);
      right: 1rem;

      input[type="radio"]:checked + label:before {
        background-color: #2ED158 !important;
      }
    }
  }
`);
