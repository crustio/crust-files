
# Share-and-Earn

<font size="6">Share Crust Files with your friends,</font>  

<font size="6">Earn $50,000,000 in User Rewards!</font>

Join our 3 Reward Programs: **INVITE BONUS**, **LUCKY NEWBIE**, and **GRAND DRAW**!

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

<h2 id="lucky_newbie">{`LUCKY NEWBIE - detailed rules`}</h2>

### Basics  

This is a non-stop game. Any newly registered Premium User has a chance to win the entire prize pool if the winning conditions are met:  

**The last Premium User to join before the countdown reaches zero is the winner of the current pool. Every time a new Premium User joins, the countdown timer resets to 30 minutes and 0.4 CRU is added to the prize pool.**  

The size of prize pool will continue to grow if: 1) No one meets the winning condition, and 2) before it reaches the cap. The cap is currently set to 100,000 CRU. When the cap is reached, the prize will be moved to the GRAND DRAW pool.

### How to play

Any new Premium User has a chance to win the current prize pool!  

Registering a Premium User in Crust Files will generate an **on-chain transaction** that records the registration information. This transaction is the ONLY valid identifier to a Premium User's identity, and the ONLY basis for determining the winner in the LUCKY NEWBIE game (as well in the other two Reward Programs!).  

Similarly, the timer in this game counts time according to the **block height** on Crust's blockchain, which produces a block every 6 seconds - 30 minutes = 300 blocks passed on-chain.  

<h2 id="grand_draw">{`GRAND DRAW - detailed rules`}</h2>

### Basics

This is a lucky draw game.  

Every time the total number of Premium Users hits a certain milestone, a lucky draw will be held. The prize pool will grow bigger with every milestone we hit.  

We define a valid Premium User by a specific on-chain transaction that marks his/her registration. We then take the **tx hash** of this transaction as one's permanent **Draw Ticket**. Every Premium User can find their Draw Ticket on the Share-and-Earn page.  

### How to play

1. Wait until the pool gets unlocked  

Each time a new milestone is reached a new pool will be unlocked (open for sign up). Keep an eye on the progress for the next unlock!  

2. Sign up for the draw  

You will have 3 days to sign up after the pool is unlocked. Click the 'Sign Up' button before the due date to participate in the draw for the next pool.  

3. The draw result  

In the sign up stage, a future block will be decided (by block height) to be the 'Draw Block'. The winners will be those whose 'Drawing Ticket' share the same last n (n could be 1, 2, or 3, should be pre-determined) digits with the block hash of the 'Draw Block'.  

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




