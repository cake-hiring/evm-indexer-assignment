/**
 * We 💜 automated tests at Cake.
 * Any code introducing new behaviour should be accompanied by tests to
 * clearly demonstrate said behaviour and the expectations surrounding it.
 *
 * Have fun! 🚀
 */

import { Test, TestingModule } from '@nestjs/testing'
import { Erc20IndexController } from './Erc20IndexController'
import { Erc20IndexModule } from './Erc20IndexModule'
import { JsonRpcProvider } from 'ethers'
import { EthersProvider } from './Erc20BalanceService'

let testingModule: TestingModule

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let controller: Erc20IndexController

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let provider: JsonRpcProvider

beforeAll(async () => {
  testingModule = await Test.createTestingModule({
    imports: [
      Erc20IndexModule
    ]
  }).compile()

  await testingModule.init()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  controller = testingModule.get(Erc20IndexController)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider = testingModule.get<JsonRpcProvider>(EthersProvider)

  // Optional: fork mainnet and simulate transactions to further test indexing correctness
  // ganache = await new GanacheContainer().start();
})

afterAll(async () => {
  await testingModule.close()
})

describe('/erc20', () => {
  it('should return correct ERC20 historical balances', async () => {
  })

  // TODO: Add tests
})
