import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { KpisSeguimientoService } from './kpis-seguimiento.service';
import { KpiSeguimientoResponseDto, ResumenKpisDto } from './dto/kpis-seguimiento.dto';

@Controller('kpis-seguimiento')
export class KpisSeguimientoController {
  constructor(private readonly kpisSeguimientoService: KpisSeguimientoService) {}

  /**
   * GET /api/kpis-seguimiento
   * Obtiene todos los KPIs
   */
  @Get()
  async findAll(): Promise<KpiSeguimientoResponseDto[]> {
    return this.kpisSeguimientoService.findAll();
  }

  /**
   * GET /api/kpis-seguimiento/resumen
   * Obtiene resumen general de KPIs
   */
  @Get('resumen')
  async getResumen(): Promise<ResumenKpisDto> {
    return this.kpisSeguimientoService.getResumen();
  }

  /**
   * GET /api/kpis-seguimiento/filtros
   * Obtiene opciones de filtros disponibles
   */
  @Get('filtros')
  async getFilterOptions() {
    return this.kpisSeguimientoService.getFilterOptions();
  }

  /**
   * GET /api/kpis-seguimiento/componente/:componente
   * Obtiene KPIs por componente
   */
  @Get('componente/:componente')
  async findByComponente(@Param('componente') componente: string): Promise<KpiSeguimientoResponseDto[]> {
    return this.kpisSeguimientoService.findByComponente(componente);
  }


  /**
   * GET /api/kpis-seguimiento/resultado/:resultado
   * Obtiene KPIs por resultado
   */
  @Get('resultado/:resultado')
  async findByResultado(@Param('resultado') resultado: string): Promise<KpiSeguimientoResponseDto[]> {
    return this.kpisSeguimientoService.findByResultado(resultado);
  }

  /**
   * GET /api/kpis-seguimiento/frecuencia/:frecuencia
   * Obtiene KPIs por frecuencia
   */
  @Get('frecuencia/:frecuencia')
  async findByFrecuencia(@Param('frecuencia') frecuencia: string): Promise<KpiSeguimientoResponseDto[]> {
    return this.kpisSeguimientoService.findByFrecuencia(frecuencia);
  }

  /**
   * GET /api/kpis-seguimiento/:id
   * Obtiene un KPI por ID
   * IMPORTANTE: Esta ruta debe ir al final para evitar conflictos con rutas específicas
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<KpiSeguimientoResponseDto> {
    return this.kpisSeguimientoService.findById(id);
  }
}
