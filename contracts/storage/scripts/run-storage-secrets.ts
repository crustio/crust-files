// Usage: npx hardhat run --network <network> scripts/run-vigil.ts

import { ethers } from 'hardhat';

async function main() {
  const StorageSecrets = await ethers.getContractFactory('StorageSecrets');
  const storageSecrets = await StorageSecrets.deploy();
  console.log('StorageSecrets deployed to:', storageSecrets.address);

  const tx = await storageSecrets.createSecret('secret1', Buffer.from('brussels sprouts'));
  console.log('Storing a secret in', tx.hash);
  await tx.wait(3);
  try {
    console.log('Checking the secret1');
    const secret1 = await storageSecrets.callStatic.revealSecret('secret2');
    console.log('The secret1 ingredient is', Buffer.from(secret1.slice(2), 'hex').toString());
  } catch (e: any) {
    console.log('failed to fetch secret1:', e.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
