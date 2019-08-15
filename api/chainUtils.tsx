import shajs from 'sha.js';

import { Vote, Block } from './blockchain';

export function hashVote(vote: Vote): string {
  return shajs('sha256')
    .update(
      vote.from + vote.to + vote.electionId + vote.position + vote.timestamp
    )
    .digest('hex');
}

export const genesisBlock: Block = {
  hash: '000767da7e56264368c96030e274be80bae945ca9e3a512ad126fac473438833',
  previousHash: '0',
  nonce: 224,
  // @ts-ignore
  vote: {}
};

/**
 * Find longest chain the blockchain
 *
 * 1. Start at the genesis block
 * 2. Move the the block connected to the genesis block
 * 3. Push the genesis block to a list of visited blocks
 * 4. Repeat step 1 with this new block
 * 5. End when no other blocks has previousHash equal to
 *    the current block
 *
 * For forks, duplicate the history list and concurrently
 * work on both forks.
 *
 */
export function getLongestChain(blockchain: Block[]): Block[] {
  const found = [];

  function buildLink(parent: Block, history = []) {
    var next = blockchain.filter(item => item.previousHash === parent.hash);

    if (next.length === 0) {
      return found.push([parent, ...history]);
    } else {
      return next.forEach(item => {
        return buildLink(item, [parent, ...history]);
      });
    }
  }

  buildLink(blockchain.find(block => block.previousHash === '0'));

  return found.sort((a, b) => b.length - a.length)[0];
}

export function sortBlockchain(chain: Block[]) {
  const itemsByPrev = chain.reduce((a, item) => {
    a[item.previousHash] = item;
    return a;
  }, {});

  const sorted = [];
  const { length } = chain;
  let lastId = 0;

  while (sorted.length < length) {
    const obj = itemsByPrev[lastId];
    sorted.push(obj);
    lastId = obj.hash;
  }

  return sorted;
}

type BlockchainActions = { type: 'UPDATE'; value: Block[] };

export function blockchainReducer(
  blockchain: Block[],
  action: BlockchainActions
) {
  if (action.type !== 'UPDATE') throw new Error('HOBE NAH TOH!');

  const updates = [];
  action.value.forEach(newBlock => {
    const calculatedHash = shajs('sha256')
      .update(
        JSON.stringify(newBlock.vote) +
          newBlock.previousHash +
          String(newBlock.nonce)
      )
      .digest('hex');

    if (
      blockchain.find(
        block =>
          block.hash === newBlock.hash &&
          block.previousHash === newBlock.previousHash
      ) ||
      calculatedHash !== newBlock.hash
    )
      return;

    updates.push(newBlock);
  });

  return [...blockchain, ...updates];
}