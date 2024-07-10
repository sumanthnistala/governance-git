const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GovernanceModule", (m) => {
  const governance = m.contract("GovernanceDAO");

  return { governance };
});
