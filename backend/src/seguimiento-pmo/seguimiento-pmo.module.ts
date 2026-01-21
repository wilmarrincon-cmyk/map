import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeguimientoPmoController } from './seguimiento-pmo.controller';
import { SeguimientoPmoService } from './seguimiento-pmo.service';
import { SeguimientoEntregable } from './entities/seguimiento-entregable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeguimientoEntregable])],
  controllers: [SeguimientoPmoController],
  providers: [SeguimientoPmoService],
  exports: [SeguimientoPmoService],
})
export class SeguimientoPmoModule {}
