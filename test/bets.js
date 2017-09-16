const PredictionMarket = artifacts.require('./PredictionMarket.sol')
const helpers = require('./helpers.js')
const sha3 = require('js-sha3')
const keccak = sha3.keccak256
const { wait, waitUntilBlock } = require('@digix/tempo')(web3);

const addQuestion = helpers.addQuestion
const createDefaultQuestionParams = helpers.createDefaultQuestionParams
const acc = helpers.accounts()

contract('PredictionMarket', account => {

	var instance;

	beforeEach(async function() {
		instance = await PredictionMarket.new({from: acc.admin})
		defaultQuestionParams = createDefaultQuestionParams(instance)
	})

	it('Should allow bets to be placed', async function () {
		await addQuestion(defaultQuestionParams)

      questionHash = "0x"+keccak(defaultQuestionParams.question)
		position = [2, 3]

		tx = await instance.createPosition(questionHash, position,
			{from: acc.nonadmin, value: web3.toWei(1, 'ether'), gas: 3000000})

 		totalInFavour = defaultQuestionParams.initialPosition[0] + position[0]
 		totalAgainst = defaultQuestionParams.initialPosition[1] + position[1]

		// Check that the event logged is correct
      args = tx.logs[0].args
		assert.equal(args.createdBy, 		   acc.nonadmin,  "Event log did not match")
		assert.equal(args.totalInFavour, 	totalInFavour, "Event log did not match")
		assert.equal(args.totalAgainst,     totalAgainst,  "Event log did not match")
		assert.equal(args.positionInFavour, position[0],   "Event log did not match")
		assert.equal(args.positionAgainst,  position[1],   "Event log did not match")

		// Check that the position has been stored
		instance.getPosition(questionHash, acc.nonadmin)
		.then(newPosition => {
			assert.equal(position[0], newPosition[0].toNumber())
			assert.equal(position[1], newPosition[1].toNumber())
		})

		// Check that the odds of the bet have been updated correctly
		instance.getBetOdds(questionHash)
		.then(newOdds => {
			assert.equal(totalInFavour, newOdds[0].toNumber())
			assert.equal(totalAgainst, newOdds[1].toNumber())
		})
	})

	it('Should return excess funds if ether sent exceeds value of bet', async () => {
		beforeBal = web3.eth.getBalance(acc.admin)

		tx = await addQuestion(defaultQuestionParams)

		totalBet  = defaultQuestionParams.initialPosition[0].plus(defaultQuestionParams.initialPosition[1])
		gasPrice  = web3.toBigNumber(defaultQuestionParams.gasPrice)
		txFee     = gasPrice.times(tx.receipt.gasUsed)	
		totalCost = txFee.plus(totalBet)
		afterBal  = web3.eth.getBalance(acc.admin)

		assert(afterBal.minus(beforeBal.minus(totalCost)).toString(), 0, 'Funds were not returned')
	})

	it('Should not allot bets to be closed prematurely.', async () => {

	})

	it('Should not allow betting on non-open bets.', async () => {
		await addQuestion(defaultQuestionParams)
		await waitUntilBlock(0, defaultQuestionParams.timeOfBetClose)
	
      questionHash = "0x"+keccak(defaultQuestionParams.question)
		position = [2, 3]
		result = true // no preference on the outcome

		await instance.closeBet(questionHash, result, {from: acc.admin, gas: 3000000})

		helpers.assertThrow(() =>
			instance.createPosition(questionHash, position,
				{from: acc.nonadmin, value: web3.toWei(1, 'ether'), gas: 3000000}),
		   'Bet placed on closed question'
	   )
	})

	it('Should fail if not ether is sent.', () => {
	})

	it('Should fail if no gas is sent.', () => {

	})

})
