# Users

## User Account and Sign-in

All users are asked to sign in Crust Files with a supported crypto wallet.  

No user account. No password. Your wallet address is your unique identifier in Crust Files.  

If you have no wallet, just get a <font color="red">Crust Wallet</font> [here](https://chrome.google.com/webstore/detail/crust-wallet/jccapkebeeiajkkdemacblkjhhhboiek?hl=en) 

## User Plan

There are two types of users defined by Crust Files's User Plan: <font color="blue">**Premium User**</font> and <font color="blue">**Trial User**</font>.

### Benefits
**<font color="blue">Premium User</font>**  

- More Space
- Maximum Upload Size = 1GB
- File Encryption ('Vault' Mode available)
- Full Crust's DSM capabilities:
  - Renew on-chain storage order
  - Place 'permanent storage order'
- Enjoy CRU Rewards from the 'Share-and-Earn' activity
- Priority access to future airdrops and other exclusive benefits

**<font color="blue">Trial User</font>**  

- Limited Space
- Maximum Upload Size = 40MB
- No File Encryption ('Vault' Mode not available)
- No Crust's DSM capabilities:
  - Storage order expires in 6 months and no renew
  - No 'permanet storage order'
- Cannot have rewards from the 'Share-and-Earn' activity
- Limited access to future airdrops or other exclusive benefits

### Requirements (How to become a Premium User)

A Premium User, to some extent, is Crust Files' formal user, because full benefits and capabilities naturally ask for a Crust Wallet and CRU payment (in some future features).

To become a Premium User, you need:

- Step 1: **Sign in** with a <font color="red">Crust Wallet</font>

- Step 2: **Deposit** a small amount of <font color="red">CRU Token</font> into a contract address. 
  - The deposit is redeemable after 180 days (counted by block height on Crust's blockchain).
  - After redeem, you lose your Premium User status and all of the corresponding benefits.
  
## Deposit and Redeem Deposit

### Deposit

Go to Premium User page and click Deposit button. An on-chain deposit transaction will be created and signed by your Crust account.  

On-chain finalization could take some time. After transaction finalization, you will become a Premium User.  

### Redeem Deposit

You can redeem your deposit after 180 days from your deposit action.

Go to Premium User page, and click Redeem Deposit button. An on-chain request transaction will be created and signed by your Crust account.   

Redeem Deposit will be processed on request from the blockchain. Please wait and check your wallet balance.  

### Appendix 1: How to Deposit with Crust Network Extrinsics

If you want to make a valid **Deposit Transaction** on your own (outside of Crust Files frontend), follow the instructions:  

Send a batch transaction to this CRU address: `cTLLc4c7Tndroz4Hqe19nsKzepc59Jgrn5RqmioBptnnSL9Hw` 

The batch transaction can be created by submitting the extrinsic: `utility.batchAll` (calls) 

The batch consists of two transactions. 

The first one is a `balances.transfer` with the deposit amount of CRU tokens. The transfer should contain enough funds as required.   

The second one is a `system.remark(_remark)` with contents:  

```
{
  "scope": "crustFiles",
  "env": "prod",
  "action": "deposit",
  "share_from": ""
}
```
If you have an inviter, put inviter's Crust address in the "share_from" field.

### Appendix 2: How to Claim Mis-Deposit Back

Mis-deposit refers to the deposit transactions that do not meet our requirement.  

For example, the transaction which contains inssuficient amount of CRU as required may leads to an invalid deposit.  

If you want to claim back your funds transferred with mis-deposits, please follow these instructions:

Send a `system.remark(_remark)` with contents

```
{
  "scope": "crustFiles",
  "env": "prod",
  "action": "claimMisDeposit",
}
```
from the same Crust address that has sent mis-deposit transactions.

You will receive all of the mis-deposited funds (should be more than 0.1 CRU) within a single transfer with a charge of 0.1 CRU claim fee.















