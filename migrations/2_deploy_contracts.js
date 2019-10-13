var basicapp = artifacts.require("./basicapp.sol")

module.exports = function(deployer) {
    deployer.deploy(basicapp);
};
