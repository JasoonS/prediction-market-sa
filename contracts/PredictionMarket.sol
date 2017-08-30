pragma solidity ^0.4.16;

contract PredictionMarket {
    address public admin;
    mapping (bytes32 => Question) questions;

    struct Question {
        string questionStatement;
        mapping (address => Position) positions;
        uint inFavour;
        uint against;
        uint timeOfBetClose;
        uint resolutionDeadlineTime;
        address trustedSource;
        bool exists;
    }
    
    struct Position {
        uint isFavour;
        uint against;
    }

    modifier isAdmin() {
        require(msg.sender == admin);
        _;
    }
    
    // modifier isAdmin() {
    //     require(msg.sender == admin);
    //     _;
    // }

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
    {   
        require(timeOfBetClose < resolutionDeadlineTime);
        
        bytes32 questionId = sha3(questionStatement);

        require(!questions[questionId].exists);
        
        uint initialQuestionValue = initialPosition[0] + initialPosition[0];
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
    }
}
