import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { 
  Configuration, 
  TypeOrmConfig 
} from './config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AdminModule } from './user/admin/admin.module';
import { CashierModule } from './user/cashier/cashier.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      load: [Configuration] 
    }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
    }), AdminModule, CashierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
