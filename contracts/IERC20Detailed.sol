// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.6.8;

interface IERC20Detailed {
  function name() external view returns (string memory);

  function symbol() external view returns (string memory);

  function decimals() external view returns (uint8);

  function balanceOf(address account) external view returns (uint256);
}
