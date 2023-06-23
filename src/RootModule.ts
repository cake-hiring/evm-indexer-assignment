import { Module } from '@nestjs/common'
import { Erc20IndexModule } from './module.erc20/Erc20IndexModule'

@Module({
  imports: [
    Erc20IndexModule
  ]
})
export class RootModule {}
