const { network } = require("hardhat")

const BASE_FEE = "250000000000000000"
const GAS_PRICE_LINK = 1e9

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (chainId == 31337) {
        log("Local network detected: Deploying Mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: args,
            log: true,
        })
        log("Mocks Deployed successfully")
    }
}

module.exports.tags = ["all", "mocks"]
