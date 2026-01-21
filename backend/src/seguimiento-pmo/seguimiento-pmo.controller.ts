import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { SeguimientoPmoService } from './seguimiento-pmo.service';
import { EntregableResponseDto, ResumenPMODto } from './dto/seguimiento-pmo.dto';

@Controller('seguimiento-pmo')
export class SeguimientoPmoController {
  constructor(private readonly seguimientoPmoService: SeguimientoPmoService) {}

  /**
   * GET /api/seguimiento-pmo
   * Obtiene todos los entregables
   */
  @Get()
  async findAll(): Promise<EntregableResponseDto[]> {
    return this.seguimientoPmoService.findAll();
  }

  /**
   * GET /api/seguimiento-pmo/resumen
   * Obtiene resumen general del PMO
   */
  @Get('resumen')
  async getResumen(): Promise<ResumenPMODto> {
    return this.seguimientoPmoService.getResumen();
  }

  /**
   * GET /api/seguimiento-pmo/filtros
   * Obtiene opciones de filtros disponibles
   */
  @Get('filtros')
  async getFilterOptions() {
    return this.seguimientoPmoService.getFilterOptions();
  }

  /**
   * GET /api/seguimiento-pmo/tipo/:tipo
   * Obtiene entregables por tipo
   */
  @Get('tipo/:tipo')
  async findByTipo(@Param('tipo') tipo: string): Promise<EntregableResponseDto[]> {
    return this.seguimientoPmoService.findByTipo(tipo);
  }

  /**
   * GET /api/seguimiento-pmo/componente/:componente
   * Obtiene entregables por componente
   */
  @Get('componente/:componente')
  async findByComponente(@Param('componente') componente: string): Promise<EntregableResponseDto[]> {
    return this.seguimientoPmoService.findByComponente(componente);
  }

  /**
   * GET /api/seguimiento-pmo/estado-plazo/:estado
   * Obtiene entregables por estado de plazo
   */
  @Get('estado-plazo/:estado')
  async findByEstadoPlazo(@Param('estado') estado: string): Promise<EntregableResponseDto[]> {
    return this.seguimientoPmoService.findByEstadoPlazo(estado);
  }

  /**
   * GET /api/seguimiento-pmo/estado-ejecucion/:estado
   * Obtiene entregables por estado de ejecución
   */
  @Get('estado-ejecucion/:estado')
  async findByEstadoEjecucion(@Param('estado') estado: string): Promise<EntregableResponseDto[]> {
    return this.seguimientoPmoService.findByEstadoEjecucion(estado);
  }

  /**
   * GET /api/seguimiento-pmo/responsable/:responsable
   * Obtiene entregables por responsable
   */
  @Get('responsable/:responsable')
  async findByResponsable(@Param('responsable') responsable: string): Promise<EntregableResponseDto[]> {
    return this.seguimientoPmoService.findByResponsable(responsable);
  }

  /**
   * GET /api/seguimiento-pmo/:id
   * Obtiene un entregable por ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<EntregableResponseDto> {
    return this.seguimientoPmoService.findById(id);
  }
}
