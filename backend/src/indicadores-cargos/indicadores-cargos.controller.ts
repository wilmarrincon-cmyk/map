import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { IndicadoresCargosService } from './indicadores-cargos.service';
import { IndicadorCargoResponseDto, ResumenIndicadoresCargosDto } from './dto/indicador-cargo.dto';

@Controller('indicadores-cargos')
export class IndicadoresCargosController {
  constructor(private readonly indicadoresCargosService: IndicadoresCargosService) {}

  /**
   * GET /api/indicadores-cargos
   * Obtiene todos los indicadores
   */
  @Get()
  async findAll(): Promise<IndicadorCargoResponseDto[]> {
    return this.indicadoresCargosService.findAll();
  }

  /**
   * GET /api/indicadores-cargos/resumen
   * Obtiene resumen general de indicadores
   */
  @Get('resumen')
  async getResumen(): Promise<ResumenIndicadoresCargosDto> {
    return this.indicadoresCargosService.getResumen();
  }

  /**
   * GET /api/indicadores-cargos/filtros
   * Obtiene opciones de filtros disponibles
   */
  @Get('filtros')
  async getFilterOptions() {
    return this.indicadoresCargosService.getFilterOptions();
  }

  /**
   * GET /api/indicadores-cargos/cargo/:cargo
   * Obtiene indicadores por cargo
   */
  @Get('cargo/:cargo')
  async findByCargo(@Param('cargo') cargo: string): Promise<IndicadorCargoResponseDto[]> {
    return this.indicadoresCargosService.findByCargo(cargo);
  }

  /**
   * GET /api/indicadores-cargos/resultado/:resultado
   * Obtiene indicadores por resultado
   */
  @Get('resultado/:resultado')
  async findByResultado(@Param('resultado') resultado: string): Promise<IndicadorCargoResponseDto[]> {
    return this.indicadoresCargosService.findByResultado(resultado);
  }

  /**
   * GET /api/indicadores-cargos/frecuencia/:frecuencia
   * Obtiene indicadores por frecuencia
   */
  @Get('frecuencia/:frecuencia')
  async findByFrecuencia(@Param('frecuencia') frecuencia: string): Promise<IndicadorCargoResponseDto[]> {
    return this.indicadoresCargosService.findByFrecuencia(frecuencia);
  }

  /**
   * GET /api/indicadores-cargos/:id
   * Obtiene un indicador por ID
   * IMPORTANTE: Esta ruta debe ir al final para evitar conflictos con rutas específicas
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<IndicadorCargoResponseDto> {
    return this.indicadoresCargosService.findById(id);
  }
}
