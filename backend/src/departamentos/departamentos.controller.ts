import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { DepartamentoResponseDto } from './dto/departamento.dto';

@Controller('departamentos')
export class DepartamentosController {
  constructor(private readonly departamentosService: DepartamentosService) {}

  /**
   * GET /api/departamentos
   * Obtiene todos los departamentos
   */
  @Get()
  async findAll(): Promise<DepartamentoResponseDto[]> {
    return this.departamentosService.findAll();
  }

  /**
   * GET /api/departamentos/search?nombre=xxx
   * Busca departamentos por nombre
   */
  @Get('search')
  async search(
    @Query('nombre') nombre: string,
  ): Promise<DepartamentoResponseDto[]> {
    if (!nombre) {
      return this.departamentosService.findAll();
    }
    return this.departamentosService.searchByNombre(nombre);
  }

  /**
   * GET /api/departamentos/dane/:codigoDane
   * Obtiene un departamento por código DANE
   */
  @Get('dane/:codigoDane')
  async findByCodigoDane(
    @Param('codigoDane', ParseIntPipe) codigoDane: number,
  ): Promise<DepartamentoResponseDto> {
    return this.departamentosService.findByCodigoDane(codigoDane);
  }

  /**
   * GET /api/departamentos/codigo/:codigo
   * Obtiene un departamento por código Highcharts
   */
  @Get('codigo/:codigo')
  async findByCodigo(
    @Param('codigo') codigo: string,
  ): Promise<DepartamentoResponseDto> {
    return this.departamentosService.findByCodigo(codigo);
  }
}
