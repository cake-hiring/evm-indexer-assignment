import { ethers, parseEther, Provider } from 'ethers';
import fetch, { Headers } from 'node-fetch';
import { AbstractStartedContainer, GenericContainer, Wait } from 'testcontainers';

const GANACHE_PORT = 8545;

export interface GanacheOptions {
  /**
   * @see https://hub.docker.com/r/trufflesuite/ganache/tags
   */
  image?: string;

  /**
   * @see https://github.com/trufflesuite/ganache#startup-options
   */
  startupFlags?: string[];
}

/**
 * A Docker container running Ganache. Allows programmatic control of
 * a local testing EVM chain for deterministic testing.
 * @see https://github.com/trufflesuite/ganache
 * @see https://trufflesuite.github.io/ganache/
 */
export class GanacheContainer extends GenericContainer {
  constructor(options?: GanacheOptions) {
    super(options?.image ?? 'trufflesuite/ganache:v7.8.0');
    this.withExposedPorts(GANACHE_PORT)
      .withCommand(options?.startupFlags ?? [
        '--miner.blockTime=0',
        '--miner.instamine=strict',
      ])
      .withStartupTimeout(180_000)
      .withWaitStrategy(Wait.forLogMessage(/RPC Listening on 0.0.0.0:8545/));
  }

  /**
   * When this method is called, the container mines 1001 blocks (0x3e9 in hex)
   * @return {Promise<StartedGanacheContainer>}
   */
  override async start(): Promise<StartedGanacheContainer> {
    return new StartedGanacheContainer(await super.start());
  }
}

export class StartedGanacheContainer extends AbstractStartedContainer {
  #provider?: Provider;

  getHostUrl(): string {
    return `http://${this.getHost()}:${this.getMappedPort(GANACHE_PORT)}`;
  }

  get provider(): Provider {
    if (this.#provider === undefined) {
      this.#provider = new ethers.WebSocketProvider(this.getHostUrl());
    }

    return this.#provider;
  }

  /**
   * For convenience's sake, utility rpc for the current container.
   * JSON 'result' is parsed and returned
   * @throws TestBlockchainRpcError is raised for any errors arising from the RPC
   */
  async call(method: string, params: any[]): Promise<any> {
    const body = JSON.stringify({
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * 100_000_000_000_000),
      method,
      params,
    });

    const text = await this.post(body);
    const { result, error } = JSON.parse(text);

    if (error !== undefined && error !== null) {
      throw error;
    }

    return result;
  }

  /**
   * For convenience’s sake, HTTP POST to the RPC URL for the current container.
   * Not error checked, returns the raw JSON as string.
   */
  async post(body: string): Promise<string> {
    const url = this.getHostUrl();
    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    return response.text();
  }

  /**
   * Sets the address' balance to the specified amount. The Ganache EVM will mine a block before returning
   */
  async fundAddress(address: string, amountEth: string): Promise<void> {
    // convert amount to fund to hex
    const weiInHex = parseEther(amountEth).toString(16);
    const fundAccountStatus = await this.call('evm_setAccountBalance', [address, weiInHex]);

    if (fundAccountStatus === false) {
      throw Error('Something went wrong with funding the account with the specified amount');
    }
  }

  async generate(numBlocks: number): Promise<void> {
    await this.call('evm_mine', [{ blocks: numBlocks }]);
  }

  async isContractDeployed(address: string, blockTag?: string): Promise<boolean> {
    const code = await this.call('eth_getCode', [address, blockTag ?? 'latest']);
    return code !== '0x';
  }
}
