pragma solidity ^0.4.15;

contract PredictionMarket {
    address public admin;
    mapping (bytes32 => Question) public questions;

    event QuestionAddedEvent(string question, uint inFavour, uint against);
    event LogClaim(address indexed recipient, bytes32 indexed questionId, uint inFavour, uint against);
    //Todo - use safemath

    struct Question {
        string questionStatement;
        mapping (address => Position) positions;
        uint inFavour;
        uint against;
        // TODO:: use block numbers instead of unix time for these values. (prevent potential manipulation via use of inacurate clocks by miners)
        uint timeOfBetClose;
        uint resolutionDeadlineTime;
        uint winningsClaimDeadline;

        address trustedSource;
        bool exists;

        // result info: (only used when resolved)
        bool resolved; // the outcome of the question (true/false) has been submitted.
        uint finalInFavour;
        uint finalAgainst;
        bool result;
    }

    struct Position {
        uint inFavour;
        uint against;
        bool isClaimed;
    }

    modifier isAdmin() {
        require(msg.sender == admin);
        _;
    }

    modifier betIsUnresolved(bytes32 questionId) {
        require(block.timestamp < questions[questionId].timeOfBetClose);
        _;
    }

    modifier betStillOpen(bytes32 questionId) {
        require(block.timestamp < questions[questionId].timeOfBetClose);
        _;
    }

    modifier isBetResolvePeriod(bytes32 questionId) {
        require(block.timestamp > questions[questionId].timeOfBetClose);
        require(block.timestamp < questions[questionId].resolutionDeadlineTime);
        _;
    }

    modifier isClaimPeriod(bytes32 questionId) {
        require(block.timestamp > questions[questionId].resolutionDeadlineTime);
        require(block.timestamp < questions[questionId].winningsClaimDeadline);
        _;
    }

    modifier betIsResolved(bytes32 questionId) {
        require(questions[questionId].resolved);
        _;
    }

    function PredictionMarket() {
      admin = msg.sender;
    }

    function addQuestion (
        string questionStatement,
        uint[2] initialPosition,
        address trusteSsorce,
        uint timeOfBetClose,
        uint resolutionDeadlineTime,
        uint winningsClaimDeadline
    )
        external
        payable
        isAdmin
        returns(bytes32)
    {
        require(timeOfBetClose < resolutionDeadlineTime);

        bytes32 questionId = sha3(questionStatement);

        require(!questions[questionId].exists);

        uint initialQuestionValue = initialPosition[0] + initialPosition[1];
        require(msg.value >= initialQuestionValue);
        if (msg.value > initialQuestionValue) {
            msg.sender.transfer(msg.value - initialQuestionValue);
        }
        questions[questionId].questionStatement = questionStatement;
        questions[questionId].inFavour = initialPosition[0];
        questions[questionId].against = initialPosition[1];
        questions[questionId].timeOfBetClose = timeOfBetClose;
        questions[questionId].resolutionDeadlineTime = resolutionDeadlineTime;
        questions[questionId].winningsClaimDeadline = winningsClaimDeadline;
        questions[questionId].trustedSource = trusteSsorce;

        QuestionAddedEvent(questionStatement, initialPosition[0], initialPosition[1]);

        return questionId;
    }

    function createPosition (bytes32 questionId, uint[2] initialPosition)
        external
        payable
        betStillOpen(questionId)
        returns (bool)
    {
        uint initialQuestionValue = initialPosition[0] + initialPosition[1];
        require(msg.value >= initialQuestionValue);
        if (msg.value > initialQuestionValue) {
            msg.sender.transfer(msg.value - initialQuestionValue);
        }

        questions[questionId].inFavour += initialPosition[0];
        questions[questionId].against += initialPosition[1];

        questions[questionId].positions[msg.sender].inFavour += initialPosition[0];
        questions[questionId].positions[msg.sender].against += initialPosition[1];
    }

    function getPosition (bytes32 questionId, address user)
        external
        constant
        returns (uint inFavour, uint against)
    {
        inFavour = questions[questionId].positions[user].inFavour;
        against = questions[questionId].positions[user].against;
    }

    function getBetOdds (bytes32 questionId)
        external
        constant
        returns (uint inFavour, uint against)
    {
        inFavour = questions[questionId].inFavour;
        against = questions[questionId].against;
    }

    function closeBet (bytes32 questionId, bool result)
        external
        isBetResolvePeriod(questionId)
        betIsUnresolved(questionId)
        returns(bool)
    {
        questions[questionId].resolved = true;
        questions[questionId].result = result;
        questions[questionId].finalInFavour = questions[questionId].inFavour;
        questions[questionId].finalAgainst = questions[questionId].against;
        return true;
    }

    function calculatePayout(bytes32 questionId, address user)
        public
        /*constant*/
        betIsResolved(questionId)
        returns (uint)
    {
        return calculatePayoutMath(
            questions[questionId].finalInFavour,
            questions[questionId].finalAgainst,
            questions[questionId].positions[user].inFavour,
            questions[questionId].positions[user].against,
            questions[questionId].result
        );
    }

    function calculatePayoutMath(uint inFavour, uint against, uint userFor, uint userAgainst, bool result)
        internal
        constant
        returns (uint)
    {
        uint numerator;
        uint denominator;
        uint scalor;

        if (result) {
            numerator = against;
            denominator = inFavour;
            scalor = userFor;
        } else {
            numerator = inFavour;
            denominator = against;
            scalor = userAgainst;
        }
        // TODO:: Safe math! The `*` is particularly prone to overflow. Find way to mitigate this.
        return scalor + ((scalor * numerator) / denominator);
    }

    function claimWinnings(bytes32 questionId)
        external
        constant
        isClaimPeriod(questionId)
        returns (bool)
    {
        // perform optimistic accounting to prevent chances of re-entry attack.
        uint toSend = this.calculatePayout(questionId, msg.sender);
        questions[questionId].positions[msg.sender].isClaimed = true;

        if (msg.sender.send(toSend)) {
            LogClaim(
                msg.sender,
                questionId,
                questions[questionId].positions[msg.sender].inFavour,
                questions[questionId].positions[msg.sender].against
            );
            return true;
        } else {
            questions[questionId].positions[msg.sender].isClaimed = false;
            return false;
        }
    }
    // TODO: add a `withdrawRemaining` function that can only be called once the withdraw period is over.
}
