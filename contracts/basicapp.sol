pragma solidity ^0.5.0;

contract basicapp{
    uint public count = 0;

    struct temperature {
        uint id;
        string content;
    }

    mapping(uint => temperature) public temps;

    constructor() public {
        addTemp("First temperature");
    }

    function addTemp(string memory _content) public {
        count++;
        temps[count] = temperature(count, _content);
    }
}
