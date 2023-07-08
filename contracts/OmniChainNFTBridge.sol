//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/token/onft/IONFT721.sol";
import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/token/onft/ONFT721Core.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract OmniChainNFTBridge is ONFT721Core, ERC721, IONFT721 {
    uint private mintCost;
    uint public tokenCount;
    uint public maxSupply;
    constructor(string memory _name, string memory _symbol, address _lzEndpoint) ERC721(_name, _symbol) ONFT721Core(_lzEndpoint) {
        tokenCount = 0;
        maxSupply = 9000;
    }
    function supportsInterface(bytes4 interfaceId) public view virtual override(ONFT721Core, ERC721, IERC165) returns (bool) {
        return interfaceId == type(IONFT721).interfaceId || super.supportsInterface(interfaceId);
    }
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        return string(abi.encodePacked("ipfs://QmTNBQDbggLZdKF1fRgWnXsnRikd52zL5ciNu769g9JoUP/",Strings.toString(tokenId)));
    }
    function mintToken(address _msgSender) private {
        tokenCount = tokenCount + 1;
        require(tokenCount <= maxSupply, "Max Supply Is Reached!!");
        super._mint(_msgSender,  tokenCount);
    }
    function initiateMint() public payable {
        mintToken(msg.sender);
    }
    function _debitFrom(address _from, uint16, bytes memory, uint _tokenId) internal virtual override {
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "ONFT721: send caller is not owner nor approved");
        require(ERC721.ownerOf(_tokenId) == _from, "ONFT721: send from incorrect owner");
        _transfer(_from, address(this), _tokenId);
    }
    function _creditTo(uint16, address _toAddress, uint _tokenId) internal virtual override {
        require(!_exists(_tokenId) || (_exists(_tokenId) && ERC721.ownerOf(_tokenId) == address(this)));
        if (!_exists(_tokenId)) {
            _safeMint(_toAddress, _tokenId);
        } else {
            _transfer(address(this), _toAddress, _tokenId);
        }
    }
}