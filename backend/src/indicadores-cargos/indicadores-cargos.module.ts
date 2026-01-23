import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicadoresCargosController } from './indicadores-cargos.controller';
import { IndicadoresCargosService } from './indicadores-cargos.service';
import { IndicadorCargo } from './entities/indicador-cargo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndicadorCargo])],
  controllers: [IndicadoresCargosController],
  providers: [IndicadoresCargosService],
  exports: [IndicadoresCargosService],
})
export class IndicadoresCargosModule {}
