
# Share-and-Earn

## Initiatives

We never wanted our promotion to be just another old-fashioned invite-and-earn gimmick. Instead, we've put our minds and hearts to work and are excited to share with you: **Crust Files Share-and-Earn!**  

Crust Files is designed as a practical product for Web3.0, the next generation of the web. We truly want everyone to use Crust Files, have fun with Crust Files and learn more about what's behind Crust Files. By using Crust Files, you are part of the revolutionary Web3.0 future, NOW. 

Just sign in with your crypto wallet, store a file, create a share link and give it to your friends. Enjoy cool Web3.0 features and share these with your friends for exciting Share-and-Earn rewards!

## Prerequisites

To join Share-and-Earn and earn rewards, sign in with a <font color="red">Crust Wallet</font>. This activity is not open for other wallets.  

Download a Crust Wallet [here](https://chrome.google.com/webstore/detail/crust-wallet/jccapkebeeiajkkdemacblkjhhhboiek?hl=en)  

Get some CRU tokens [here](https://swap.crust.network)

<h2 id="invite_bonus">{`INVITE BONUS - detailed rules`}</h2>

### Basics

Invite your friends to use Crust Files and become **Premium Users**.  

For every successful invitation:  

- **YOU** get: **0.2 CRU reward**  

- **YOUR FRIEND** gets: **1 CRU discount on his or her Premium User Deposit** and opportunities to win fantastic prizes across 3 Reward Programs   

### How to play

1. Create a share link  

Your **nickname** will show on the share page both for you and the receiver.  

2. Invite your friend  

Invite your friends to use Crust Files and become Premium Users.  

Your **nickname** is the invitation code. Remind your friends to type in your **nickname** when they are registering a Premium User.  

<h2 id="claim_rewards">{`Claim your rewards`}</h2>

### Where are my rewards?

Check your rewards at:  

- 'My Rewards' section on the Share-and-Earn page
- Profile Info Card in the upper-right corner

Both will display your rewards.   

### How to claim my rewards?

Go to the 'My Rewards' section on the Share-and-Earn Page, and find the **Claim** button.

Click the button, sign the claim request transaction (which is an on-chain transaction on Crust Network). It's easy, just follow the process and wait.

Rewards Claims will be processed on a weekly basis by Crust Files. You will receive the rewards after no more than 7 days.  

### Appendix: How to Claim Rewards with Crust Network Extrinsics

If you want to make a valid **Claim Rewards Transaction** on your own (outside of Crust Files frontend), follow the instructions:  

Send a `system.remark(_remark)` transaction with _remark contents:   

```
{
  "scope": "crustFiles",
  "env": "prod",
  "action": "claimRewards"
}
```
to Crust address: `cTHCwE3gjf1VFyfLLeE8ibZpFUZ7dLJP4ZHJqtATr6HWFo9Bb`




