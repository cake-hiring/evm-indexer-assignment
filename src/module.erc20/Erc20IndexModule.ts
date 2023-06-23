import { Module } from '@nestjs/common'
import { Erc20IndexController } from './Erc20IndexController'
import { Erc20BalanceService, EthersProvider } from './Erc20BalanceService'
import { InfuraProvider } from 'ethers'

@Module({
  controllers: [
    Erc20IndexController
  ],
  providers: [
    Erc20BalanceService,
    {
      provide: EthersProvider,
      useFactory: () => {
        // Replace with your own if necessary
        return new InfuraProvider()
      }
    }
  ]
})
export class Erc20IndexModule {}
