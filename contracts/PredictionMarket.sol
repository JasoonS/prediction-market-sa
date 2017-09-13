pragma solidity ^0.4.15;

contract PredictionMarket {
    address public admin;
    mapping (bytes32 => Question) public questions;
    bytes32[] public questionsList; // TODO : this list is currently append only and unscalable.

    event LogQuestionAdded(string questionStatement, bytes32 indexed questionId, uint inFavour, uint against, uint timeOfBetClose, uint resolutionDeadlineTime, uint winningsClaimDeadline, address trustedSource);
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

        uint moneyInPot;
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

    modifier claimPeriodComplete(bytes32 questionId) {
        require(block.timestamp > questions[questionId].winningsClaimDeadline);
        _;
    }

    modifier betIsResolved(bytes32 questionId) {
        require(questions[questionId].resolved);
        _;
    }

    modifier canClaim(bytes32 questionId, address user) {
        require(!questions[questionId].positions[msg.sender].isClaimed);
        _;
    }

    function PredictionMarket() {
        admin = msg.sender;
    }

    function addQuestion (
        string questionStatement,
        uint[2] initialPosition,
        address trustedSource,
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
        require(resolutionDeadlineTime < winningsClaimDeadline);

        bytes32 questionId = sha3(questionStatement);
        require(!questions[questionId].exists);

        questions[questionId].exists = true;
        questions[questionId].questionStatement = questionStatement;
        questions[questionId].inFavour = initialPosition[0];
        questions[questionId].against = initialPosition[1];
        questions[questionId].timeOfBetClose = timeOfBetClose;
        questions[questionId].resolutionDeadlineTime = resolutionDeadlineTime;
        questions[questionId].winningsClaimDeadline = winningsClaimDeadline;
        questions[questionId].trustedSource = trustedSource;
        questionsList.push(questionId);

        uint initialQuestionValue = initialPosition[0] + initialPosition[1];
        require(msg.value >= initialQuestionValue);
        if (msg.value > initialQuestionValue) {
            msg.sender.transfer(msg.value - initialQuestionValue);
        }

        LogQuestionAdded(questionStatement, questionId, initialPosition[0], initialPosition[1], timeOfBetClose, resolutionDeadlineTime, winningsClaimDeadline, trustedSource);

        return questionId;
    }

    function createPosition (bytes32 questionId, uint[2] initialPosition)
        external
        payable
        betStillOpen(questionId)
        returns (bool)
    {
        questions[questionId].inFavour += initialPosition[0];
        questions[questionId].against += initialPosition[1];

        questions[questionId].positions[msg.sender].inFavour += initialPosition[0];
        questions[questionId].positions[msg.sender].against += initialPosition[1];

        questions[questionId].moneyInPot = initialPosition[0] + initialPosition[1];

        uint initialQuestionValue = initialPosition[0] + initialPosition[1];
        require(msg.value >= initialQuestionValue);
        if (msg.value > initialQuestionValue) {
            msg.sender.transfer(msg.value - initialQuestionValue);
        }
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

    // TODO: this function is completely unscalable, add some sort of CRUD mechanism to automatically maintain question list (currently append only)
    function getQuestionList ()
        constant
        returns (bytes32[] quesitonIds)
    {
        uint length = questionsList.length;
        quesitonIds = new bytes32[](length);

        for (uint i = 0; i < length; i++) {
            quesitonIds[i] = questionsList[i];
        }
    }

    function closeBet (bytes32 questionId, bool result)
        external
        isBetResolvePeriod(questionId)
        betIsUnresolved(questionId)
        isAdmin
        returns(bool)
    {
        questions[questionId].resolved = true;
        questions[questionId].result = result;

        return true;
    }

    // TODO: if admin forgets / refuses to close the bet in time, allow users to withdraw all their funds safely.

    function calculatePayout(bytes32 questionId, address user)
        public
        constant
        betIsResolved(questionId)
        returns (uint)
    {
        return calculatePayoutMath(
            questions[questionId].inFavour,
            questions[questionId].against,
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
        isClaimPeriod(questionId)
        canClaim(questionId, msg.sender)
    {
        // perform optimistic accounting to prevent chances of re-entry attack.
        uint toSend = this.calculatePayout(questionId, msg.sender);
        questions[questionId].positions[msg.sender].isClaimed = true;

        msg.sender.transfer(toSend);

        questions[questionId].moneyInPot = 0;
        LogClaim(
            msg.sender,
            questionId,
            questions[questionId].positions[msg.sender].inFavour,
            questions[questionId].positions[msg.sender].against
        );
    }

    // once the claim period is over - the market-maker (in this case the admin) can retrieve all remaining funds.
    function withdrawRemaining(bytes32 questionId)
        external
        claimPeriodComplete(questionId)
        isAdmin
    {
        require(questions[questionId].moneyInPot > 0);

        // perform optimistic accounting to prevent chances of re-entry attack.
        uint toSend = questions[questionId].moneyInPot;
        questions[questionId].moneyInPot += toSend;

        msg.sender.transfer(toSend);

        // TODO: add relevant 'Log'
    }
}
