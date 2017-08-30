pragma solidity ^0.4.15;

contract PredictionMarket {
    address public admin;
    mapping (bytes32 => Question) questions;

    event QuestionAddedEvent(string question, uint inFavour, uint against);

    //Todo - use safemath

    struct Question {
        string questionStatement;
        mapping (address => Position) positions;
        uint inFavour;
        uint against;
        uint timeOfBetClose;
        uint resolutionDeadlineTime;
        address trustedSource;
        bool exists;
        Result result;
    }
    
    struct Position {
        uint inFavour;
        uint against;
    }
    
    struct Result {
        bool created;
        uint[2] finalOdds;
        bool result;
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

    function PredictionMarket() {
      admin = msg.sender;
    }
    
    function addQuestion (
        string questionStatement,
        uint[2] initialPosition,
        address trusteSsorce,
        uint timeOfBetClose,
        uint resolutionDeadlineTime
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
        questions[questionId].trustedSource = trusteSsorce;
        
        QuestionAddedEvent(questionStatement, initialPosition[0], initialPosition[1]);

        return questionId;
    }

    function createPosition (bytes32 questionId, uint[2] initialPosition)
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
    
    function getPosition (bytes32 questionId)
        public
        returns (uint inFavour, uint against)
    {
        inFavour = questions[questionId].positions[msg.sender].inFavour;
        against = questions[questionId].positions[msg.sender].against;
    }
    
    function getBetOdds (bytes32 questionId)
        public
        returns (uint inFavour, uint against)
    {
        inFavour = questions[questionId].inFavour;
        against = questions[questionId].against;
    }
    
    function closeBet (bytes32 questionId, bool result)
        isBetResolvePeriod(questionId)
        betIsUnresolved(questionId)
        returns(bool)
    {
        questions[questionId].result.created = true;
        questions[questionId].result.result = result;
        questions[questionId].result.finalOdds = [questions[questionId].inFavour, questions[questionId].against];
        return true;
    }
}
