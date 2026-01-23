import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpisControlGerenciaController } from './kpis-control-gerencia.controller';
import { KpisControlGerenciaService } from './kpis-control-gerencia.service';
import { KpiControlGerencia } from './entities/kpi-control-gerencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KpiControlGerencia])],
  controllers: [KpisControlGerenciaController],
  providers: [KpisControlGerenciaService],
  exports: [KpisControlGerenciaService],
})
export class KpisControlGerenciaModule {}
