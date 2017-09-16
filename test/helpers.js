const acc = web3.eth.accounts
const admin = acc[0]
const trusted = acc[1]
const nonadmin = acc[2]

var helpers = module.exports = {
  addQuestion: function ({instance, question, initialPosition, trustedSource, timeOfBetClose, resolvePeriod, claimPeriod, from, value, gas}) {
    return instance.addQuestion(
      question, initialPosition, trustedSource, timeOfBetClose, timeOfBetClose+resolvePeriod, timeOfBetClose+resolvePeriod+claimPeriod,
      {from: from, value: 3, gas: 3000000}
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
    now = Date.now()

    from = admin

    question = 'Who will win the World Cup?'
    initialPosition = [1, 2]
    trustedSource = trusted
    timeOfBetClose = web3.eth.blockNumber + 10
    resolvePeriod = 20
    claimPeriod = 30

    value = 3
    gas = 3000000

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
      gas
    }
  },

  getCurrentBlockNumber: function () {
    return web3.eth.blockNumber
  }
}
