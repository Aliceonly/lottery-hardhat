const { network, ethers } = require("hardhat")
const { deploymentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.parseEther("1")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, vrfCoordinatorV2Mock, subscriptionId

    if (chainId == 31337) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        console.log("Waiting...")
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLine = networkConfig[chainId]["gasLine"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: [
            vrfCoordinatorV2Address,
            entranceFee,
            gasLine,
            subscriptionId,
            callbackGasLimit,
            interval,
        ],
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1,
    })

    if (!deploymentChains.includes(netwrok.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying")
        await verify(raffle.address, process.env.ETHERSCAN_API_KEY)
    }
}

module.exports.tags = ["all", "raffle"]