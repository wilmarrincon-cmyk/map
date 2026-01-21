import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CircunscripcionesService } from './circunscripciones.service';
import { CircunscripcionResponseDto, PersonalCitrepResponseDto, PersonalCitrepResumenDto } from './dto/circunscripcion.dto';

@Controller('circunscripciones')
export class CircunscripcionesController {
  constructor(private readonly circunscripcionesService: CircunscripcionesService) {}

  /**
   * GET /api/circunscripciones
   * Obtiene todas las circunscripciones
   */
  @Get()
  async findAll(): Promise<CircunscripcionResponseDto[]> {
    return this.circunscripcionesService.findAll();
  }

  /**
   * GET /api/circunscripciones/search?nombre=xxx
   * Busca circunscripciones por nombre
   */
  @Get('search')
  async search(
    @Query('nombre') nombre: string,
  ): Promise<CircunscripcionResponseDto[]> {
    if (!nombre) {
      return this.circunscripcionesService.findAll();
    }
    return this.circunscripcionesService.searchByNombre(nombre);
  }

  /**
   * GET /api/circunscripciones/departamento/:departamento
   * Obtiene circunscripciones por departamento
   */
  @Get('departamento/:departamento')
  async findByDepartamento(
    @Param('departamento') departamento: string,
  ): Promise<CircunscripcionResponseDto[]> {
    return this.circunscripcionesService.findByDepartamento(departamento);
  }

  /**
   * GET /api/circunscripciones/citrep/:citrep
   * Obtiene una circunscripción por citrep
   */
  @Get('citrep/:citrep')
  async findByCitrep(
    @Param('citrep') citrep: string,
  ): Promise<CircunscripcionResponseDto> {
    return this.circunscripcionesService.findByCitrep(citrep);
  }

  /**
   * GET /api/circunscripciones/:id
   * Obtiene una circunscripción por ID
   */
  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CircunscripcionResponseDto> {
    return this.circunscripcionesService.findById(id);
  }

  // ============ Personal Citrep ============

  /**
   * GET /api/circunscripciones/personal
   * Obtiene todo el personal de citrep
   */
  @Get('personal')
  async findAllPersonal(): Promise<PersonalCitrepResponseDto[]> {
    return this.circunscripcionesService.findAllPersonal();
  }

  /**
   * GET /api/circunscripciones/personal/resumen
   * Obtiene resumen de personal
   */
  @Get('personal/resumen')
  async getPersonalResumen(): Promise<PersonalCitrepResumenDto> {
    return this.circunscripcionesService.getPersonalResumen();
  }

  /**
   * GET /api/circunscripciones/personal/por-circunscripcion
   * Obtiene conteo de personal por circunscripción
   */
  @Get('personal/por-circunscripcion')
  async getPersonalPorCircunscripcion(): Promise<{ citrep: string; departamento: string; cantidad: number }[]> {
    return this.circunscripcionesService.getPersonalPorCircunscripcion();
  }

  /**
   * GET /api/circunscripciones/personal/citrep/:citrep
   * Obtiene personal por citrep
   */
  @Get('personal/citrep/:citrep')
  async findPersonalByCitrep(
    @Param('citrep') citrep: string,
  ): Promise<PersonalCitrepResponseDto[]> {
    return this.circunscripcionesService.findPersonalByCitrep(citrep);
  }

  /**
   * GET /api/circunscripciones/personal/departamento/:departamento
   * Obtiene personal por departamento
   */
  @Get('personal/departamento/:departamento')
  async findPersonalByDepartamento(
    @Param('departamento') departamento: string,
  ): Promise<PersonalCitrepResponseDto[]> {
    return this.circunscripcionesService.findPersonalByDepartamento(departamento);
  }
}
