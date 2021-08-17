import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;

  const { deployer, admin, platformSigner } = await getNamedAccounts();

  let name: string, uri: string, sy: string, signer: string;

  if (network.tags['prd']) {
    name = 'CybertinoInteractive';
    uri = 'https://api.cybertino.io/metadata/nft/';
    sy = 'CYBER_INTERACTIVE_NFT';
    signer = '0xc044d55E0b7bD3740FD1747491A0b3C0e5387E4B';
  } else if (network.tags['stg'] || network.tags['prd-testnet']) {
    name = 'CybertinoInteractiveTest';
    uri = 'https://api.stg.cybertino.io/metadata/nft/';
    sy = 'CYBER_INTERACTIVE_NFT_TEST';
    signer = platformSigner;
  } else {
    throw 'Network not supported';
  }

  await deploy('CybertinoCanvasV0', {
    from: deployer,
    proxy: {
      proxyContract: 'OpenZeppelinTransparentProxy',
      methodName: 'CybertinoCanvas_init',
    },
    log: true,
    args: [name, uri, sy, signer, admin],
  });
};

export default func;
func.tags = ['CybertinoCanvasV0', 'interactive'];
