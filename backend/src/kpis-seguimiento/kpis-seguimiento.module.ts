import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpisSeguimientoController } from './kpis-seguimiento.controller';
import { KpisSeguimientoService } from './kpis-seguimiento.service';
import { KpisSeguimiento } from './entities/kpis-seguimiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KpisSeguimiento])],
  controllers: [KpisSeguimientoController],
  providers: [KpisSeguimientoService],
  exports: [KpisSeguimientoService],
})
export class KpisSeguimientoModule {}
