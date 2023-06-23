import { Inject, Injectable } from '@nestjs/common'
import { JsonRpcProvider } from 'ethers'

// NestJS injection token
export const EthersProvider = 'EthersProvider'

@Injectable()
export class Erc20BalanceService {
  constructor (
    @Inject(EthersProvider) private readonly provider: JsonRpcProvider
  ) {
  }

  /**
   * Retrieves the historic balance of an account for a given token
   * from a given block height to another block height.
   */
  async getBalances (params: GetBalanceParams): Promise<GetBalanceResult[]> {
    // TODO: Implement
    return []
  }
}

export interface GetBalanceParams {
  /**
   * The address of the account to retrieve the balance for
   */
  accountAddress: string

  /**
   * The address of the token to retrieve the balance for
   */
  tokenAddress: string

  /**
   * The block height to start from (inclusive)
   */
  from: number

  /**
   * The block height to end at (inclusive)
   */
  to: number

  /**
   * The granularity of the balance data
   */
  granularity: 'block' // | '1m' | '5m' | '1h'
}

export interface GetBalanceResult {
  balance: bigint
  timestamp: Date
}
