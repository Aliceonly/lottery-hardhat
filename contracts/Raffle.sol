// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFConsumerBaseV2Interface.sol";

error Raffle__NotEnoughETHEntered();

contract Raffle is VRFConsumerBaseV2 {

    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFConsumerBaseV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLine;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);

    constructor(address vrfCoordinatorV2, uint256 entranceFee, bytes32 gasLine, uint64 subscriptionId, uint32 callbackGasLimit) VRFConsumerBaseV2(vrfCoordinatorV2){
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFConsumerBaseV2Interface(vrfCoordinatorV2);
        i_gasLine = gasLine;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }
 
    function enterRaffle() public payable{
        if (msg.value < i_entranceFee) { revert Raffle__NotEnoughETHEntered(); }
        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    function requestRandomWinner() external {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(i_gasLine,i_subscriptionId,REQUEST_CONFIRMATIONS,i_callbackGasLimit,NUM_WORDS);
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {

    }

    function getEntranceFee() public view returns(uint256){
        return i_entranceFee;
    }

    function getPlayers(uint256 index) public view returns(address){
        return s_players[index];
    }
}