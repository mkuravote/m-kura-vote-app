import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SecuraToken = await hre.ethers.getContractFactory("SecuraToken");
  const securaToken = await SecuraToken.deploy(
    "0x765de816845861e75a25fca122bb6898b8b1282a",
    "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0",
    1, // CUSD rate
    50, // CKES rate
  );

  console.log("SecuraToken deployed to:", await securaToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
