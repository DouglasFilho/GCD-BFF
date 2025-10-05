import { Module } from '@nestjs/common';
import { DeputiesModule } from './modules/deputies/deputies.module';
import { ChamberModule } from './modules/chamber/chamber.module';

@Module({
  imports: [DeputiesModule, ChamberModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
