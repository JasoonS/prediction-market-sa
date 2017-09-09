module.exports = {
  addQuestion: function (instance, from, question, initialPosition, trustedSource, timeOfBetClose, resolutionDeadlineTime, winningsClaimDeadline) {
	  return instance.addQuestion(
	    question, initialPosition, trustedSource, timeOfBetClose, resolutionDeadlineTime, winningsClaimDeadline,
	    {from: from, value: 3, gas: 3000000}
	  )
  },

  handleError: function (e) {
	  if ((e + '').indexOf('invalid JUMP') || (e + '').indexOf('out of gas') || (e + '').indexOf('invalid opcode') > -1) {} else if ((e + '').indexOf('please check your gas amount') > -1) {} else {
	    throw e
	  }
  }
}
