import { Controller, Get, Param, Query } from '@nestjs/common';
import { PersonalService } from './personal.service';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

  /**
   * GET /api/personal
   * Obtiene todo el personal
   */
  @Get()
  async findAll() {
    return this.personalService.findAll();
  }

  /**
   * GET /api/personal/resumen
   * Obtiene resumen de agentes
   */
  @Get('resumen')
  async getResumen() {
    return this.personalService.getResumen();
  }

  /**
   * GET /api/personal/por-departamento
   * Obtiene conteo por departamento
   */
  @Get('por-departamento')
  async getConteoPorDepartamento() {
    return this.personalService.getConteoPorDepartamento();
  }

  /**
   * GET /api/personal/agrupado
   * Obtiene personal agrupado por departamento
   */
  @Get('agrupado')
  async getAgrupadoPorDepartamento() {
    return this.personalService.getAgrupadoPorDepartamento();
  }

  /**
   * GET /api/personal/departamento/:nombre
   * Obtiene personal de un departamento específico
   */
  @Get('departamento/:nombre')
  async findByDepartamento(@Param('nombre') nombre: string) {
    return this.personalService.findByDepartamento(nombre);
  }
}
