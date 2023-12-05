const { assert } = require('chai');
const Neonz = artifacts.require('./KryptoNeonz');

require('chai').use(require('chai-as-promised')).should();

contract('KryptoNeonz', (accounts) => {
  let contract;

  before(async () => {
    contract = await Neonz.deployed();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      assert.notEqual(contract.address, '');
      assert.notEqual(contract.address, null);
      assert.notEqual(contract.address, undefined);
      assert.notEqual(contract.address, 0x0);
    });

    it('has a name', async () => {
      const name = await contract.name();
      assert.equal(name, 'KryptoNeonz');
    });

    it('has a symbol', async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, 'KNEONZ');
    });
  });

  describe('minting', async () => {
    it('creates a new token', async () => {
      const result = await contract.mint('https://1.png');
      const totalSupply = await contract.totalSupply();

      assert.equal(totalSupply, 1);
      const event = result.logs[0].args;
      assert.equal(
        event._from,
        '0x0000000000000000000000000000000000000000',
        'from is the contract'
      );
      assert.equal(event._to, accounts[0], 'to is msg.sender');

      // Failure
      await contract.mint('https://1.png').should.be.rejected;
    });
  });

  describe('indexing', async () => {
    it('lists KryptoNeonz', async () => {
      await contract.mint('https://2.png');
      await contract.mint('https://3.png');
      await contract.mint('https://4.png');
      const totalSupply = await contract.totalSupply();
      const result = [];
      for (i = 1; i <= totalSupply; i++) {
        result.push(await contract.neonz(i - 1));
      }
      const expected = [
        'https://1.png',
        'https://2.png',
        'https://3.png',
        'https://4.png',
      ];
      assert.equal(result.join(','), expected.join(','));
    });
  });
});
