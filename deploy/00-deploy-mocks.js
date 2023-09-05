const {deploymentChains}  = require('../helper-hardhat-config');

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.name

    if(deploymentChains.includes(network.name)) {
        log("Local network detected: Deploying Mocks...")
        
    }

}
