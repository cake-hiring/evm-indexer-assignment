import { NestFactory } from '@nestjs/core'
import { Erc20IndexModule } from './module.erc20/Erc20IndexModule'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(Erc20IndexModule)
  await app.listen(3000)
}
void bootstrap()
