const { assert } = require('chai');
const Neonz = artifacts.require('./KryptoNeonz');

require('chai').use(require('chai-as-promised')).should();

contract('KryptoNeonz', async (accounts) => {
  let contract = await Neonz.deployed();

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
      assert.equal(event.from, '0x0', 'from is the contract');
      assert.equal(event.to, '');
    });
  });
});
