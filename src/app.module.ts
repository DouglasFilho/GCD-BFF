import { Module } from '@nestjs/common';
import { DeputiesModule } from './modules/deputies/deputies.module';
import { ChamberModule } from './modules/chamber/chamber.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    DeputiesModule, 
    ChamberModule,     
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        if (!url) {
          throw new Error('DATABASE_URL not found');
        }

        return {
          type: 'postgres',
          url,
          autoLoadEntities: true,
          synchronize: false,
          ssl: { rejectUnauthorized: false },
          extra: { statement_timeout: 30000, query_timeout: 30000 },
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})

export class AppModule { 
  constructor(private dataSource: DataSource) {}
}
