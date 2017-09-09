const acc = web3.eth.accounts
const admin = acc[1]
const trusted = acc[2]
const nonadmin = acc[3]

module.exports = {
  addQuestion: function ({instance, question, initialPosition, trustedSource, timeOfBetClose, resolutionDeadlineTime, winningsClaimDeadline, from, value, gas}) {
    return instance.addQuestion(
      question, initialPosition, trustedSource, timeOfBetClose, resolutionDeadlineTime, winningsClaimDeadline,
      {from: from, value: 3, gas: 3000000}
    )
  },

  handleError: function (e) {
    if ((e + '').indexOf('invalid JUMP') || (e + '').indexOf('out of gas') || (e + '').indexOf('invalid opcode') > -1) {} else if ((e + '').indexOf('please check your gas amount') > -1) {} else {
      throw e
    }
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
    timeOfBetClose = now + 10 * 60 * 1000
    resolutionDeadlineTime = now + 20 * 60 * 1000
    winningsClaimDeadline = now + 30 * 60 * 1000

    value = 3
    gas = 3000000

    return {
      instance,
      question,
      initialPosition,
      trustedSource,
      timeOfBetClose,
      resolutionDeadlineTime,
      winningsClaimDeadline,
      from,
      value,
      gas
    }
  }
}
