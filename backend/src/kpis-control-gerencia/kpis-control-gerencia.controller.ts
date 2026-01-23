import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { KpisControlGerenciaService } from './kpis-control-gerencia.service';
import { KpiControlGerenciaResponseDto, ResumenKpisControlGerenciaDto } from './dto/kpi-control-gerencia.dto';

@Controller('kpis-control-gerencia')
export class KpisControlGerenciaController {
  constructor(private readonly kpisControlGerenciaService: KpisControlGerenciaService) {}

  /**
   * GET /api/kpis-control-gerencia
   * Obtiene todos los KPIs
   */
  @Get()
  async findAll(): Promise<KpiControlGerenciaResponseDto[]> {
    return this.kpisControlGerenciaService.findAll();
  }

  /**
   * GET /api/kpis-control-gerencia/resumen
   * Obtiene resumen general de KPIs
   */
  @Get('resumen')
  async getResumen(): Promise<ResumenKpisControlGerenciaDto> {
    return this.kpisControlGerenciaService.getResumen();
  }

  /**
   * GET /api/kpis-control-gerencia/filtros
   * Obtiene opciones de filtros disponibles
   */
  @Get('filtros')
  async getFilterOptions() {
    return this.kpisControlGerenciaService.getFilterOptions();
  }

  /**
   * GET /api/kpis-control-gerencia/estado/:estado
   * Obtiene KPIs por estado
   */
  @Get('estado/:estado')
  async findByEstado(@Param('estado') estado: string): Promise<KpiControlGerenciaResponseDto[]> {
    return this.kpisControlGerenciaService.findByEstado(estado);
  }

  /**
   * GET /api/kpis-control-gerencia/periodicidad/:periodicidad
   * Obtiene KPIs por periodicidad
   */
  @Get('periodicidad/:periodicidad')
  async findByPeriodicidad(@Param('periodicidad') periodicidad: string): Promise<KpiControlGerenciaResponseDto[]> {
    return this.kpisControlGerenciaService.findByPeriodicidad(periodicidad);
  }

  /**
   * GET /api/kpis-control-gerencia/responsable/:responsable
   * Obtiene KPIs por responsable
   */
  @Get('responsable/:responsable')
  async findByResponsable(@Param('responsable') responsable: string): Promise<KpiControlGerenciaResponseDto[]> {
    return this.kpisControlGerenciaService.findByResponsable(responsable);
  }

  /**
   * GET /api/kpis-control-gerencia/:id
   * Obtiene un KPI por ID
   * IMPORTANTE: Esta ruta debe ir al final para evitar conflictos con rutas específicas
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<KpiControlGerenciaResponseDto> {
    return this.kpisControlGerenciaService.findById(id);
  }
}
