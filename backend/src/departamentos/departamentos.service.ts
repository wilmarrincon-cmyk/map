import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departamento } from './entities/departamento.entity';
import { DepartamentoResponseDto } from './dto/departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private departamentoRepository: Repository<Departamento>,
  ) {}

  /**
   * Obtiene todos los departamentos
   */
  async findAll(): Promise<DepartamentoResponseDto[]> {
    const departamentos = await this.departamentoRepository.find({
      order: { departamento: 'ASC' },
    });

    return departamentos.map((dept) => this.toResponseDto(dept));
  }

  /**
   * Obtiene un departamento por código DANE
   */
  async findByCodigoDane(codigoDane: number): Promise<DepartamentoResponseDto> {
    const departamento = await this.departamentoRepository.findOne({
      where: { codigo_dane: codigoDane },
    });

    if (!departamento) {
      throw new NotFoundException(
        `Departamento con código DANE ${codigoDane} no encontrado`,
      );
    }

    return this.toResponseDto(departamento);
  }

  /**
   * Obtiene un departamento por código Highcharts
   */
  async findByCodigo(codigo: string): Promise<DepartamentoResponseDto> {
    const departamento = await this.departamentoRepository.findOne({
      where: { codigo },
    });

    if (!departamento) {
      throw new NotFoundException(
        `Departamento con código ${codigo} no encontrado`,
      );
    }

    return this.toResponseDto(departamento);
  }

  /**
   * Busca departamentos por nombre (búsqueda parcial)
   */
  async searchByNombre(nombre: string): Promise<DepartamentoResponseDto[]> {
    const departamentos = await this.departamentoRepository
      .createQueryBuilder('dept')
      .where('LOWER(dept.departamento) LIKE LOWER(:nombre)', {
        nombre: `%${nombre}%`,
      })
      .orderBy('dept.departamento', 'ASC')
      .getMany();

    return departamentos.map((dept) => this.toResponseDto(dept));
  }

  /**
   * Convierte entidad a DTO de respuesta
   */
  private toResponseDto(departamento: Departamento): DepartamentoResponseDto {
    return {
      codigo_dane: departamento.codigo_dane,
      codigo: departamento.codigo,
      departamento: departamento.departamento,
      latitud: departamento.latitud ? Number(departamento.latitud) : undefined,
      longitud: departamento.longitud ? Number(departamento.longitud) : undefined,
      value: 0, // Valor por defecto para el mapa
    };
  }
}
