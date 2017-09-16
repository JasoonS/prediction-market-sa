const acc = web3.eth.accounts
const admin = acc[0]
const trusted = acc[1]
const nonadmin = acc[2]

var helpers = module.exports = {
  addQuestion: function ({instance, question, initialPosition, trustedSource, timeOfBetClose, resolvePeriod, claimPeriod, from, value, gas, gasPrice}) {
    return instance.addQuestion(
      question, initialPosition, trustedSource, timeOfBetClose, timeOfBetClose+resolvePeriod, timeOfBetClose+resolvePeriod+claimPeriod,
      {from, value, gas, gasPrice}
    )
  },

  handleError: function (e) {
    if ((e + '').indexOf('invalid JUMP') ||
        (e + '').indexOf('out of gas') || 
        (e + '').indexOf('invalid opcode') > -1) {}
    else if ((e + '').indexOf('please check your gas amount') > -1) {}
    else {
      throw e
    }
    return false
  },

  assertJump: (error, message = '') => {
    assert.isAbove(error.message.search('invalid'), -1, message + ': error must be returned');
  },

  assertThrow: async (callback, message = '') => {
    var error;
    try {
      await callback();
    } catch (err) {
      error = err;
    }

    if (message === undefined) message = 'Error need to be thrown'

    if (error) helpers.assertJump(error, message);
    else  assert.notEqual(error, undefined, message);
  },

  accounts: function () {
    return {admin, trusted, nonadmin}
  },

  createDefaultQuestionParams: function (instance) {
    from = admin

    question = 'Who will win the World Cup?'
    initialPosition = [web3.toBigNumber(web3.toWei(1, 'ether')), 
                       web3.toBigNumber(web3.toWei(2, 'ether'))]
    trustedSource = trusted
    timeOfBetClose = web3.eth.blockNumber + 10
    resolvePeriod = 20
    claimPeriod = 30

    value = web3.toBigNumber(web3.toWei(4, 'ether'))

    gas = 3000000
    gasPrice = 1

    return {
      instance,
      question,
      initialPosition,
      trustedSource,
      timeOfBetClose,
      resolvePeriod,
      claimPeriod,
      from,
      value,
      gas,
      gasPrice
    }
  },

  getCurrentBlockNumber: function () {
    return web3.eth.blockNumber
  }
}
