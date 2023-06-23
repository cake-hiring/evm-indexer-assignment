import { Controller } from '@nestjs/common'
import { Erc20BalanceService } from './Erc20BalanceService'

@Controller()
export class Erc20IndexController {
  constructor (private readonly erc20BalanceService: Erc20BalanceService) {}

  // TODO
}
