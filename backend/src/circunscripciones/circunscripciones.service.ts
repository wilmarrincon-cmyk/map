import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Circunscripcion } from './entities/circunscripcion.entity';
import { PersonalCitrep } from './entities/personal-citrep.entity';
import { CircunscripcionResponseDto, PersonalCitrepResponseDto, PersonalCitrepResumenDto } from './dto/circunscripcion.dto';

@Injectable()
export class CircunscripcionesService {
  constructor(
    @InjectRepository(Circunscripcion)
    private circunscripcionRepository: Repository<Circunscripcion>,
    @InjectRepository(PersonalCitrep)
    private personalCitrepRepository: Repository<PersonalCitrep>,
  ) {}

  /**
   * Obtiene todas las circunscripciones
   */
  async findAll(): Promise<CircunscripcionResponseDto[]> {
    const circunscripciones = await this.circunscripcionRepository.find({
      order: { citrep: 'ASC' },
    });

    return circunscripciones.map((circ) => this.toResponseDto(circ));
  }

  /**
   * Obtiene una circunscripción por ID
   */
  async findById(id: number): Promise<CircunscripcionResponseDto> {
    const circunscripcion = await this.circunscripcionRepository.findOne({
      where: { id },
    });

    if (!circunscripcion) {
      throw new NotFoundException(
        `Circunscripción con ID ${id} no encontrada`,
      );
    }

    return this.toResponseDto(circunscripcion);
  }

  /**
   * Obtiene una circunscripción por citrep
   */
  async findByCitrep(citrep: string): Promise<CircunscripcionResponseDto> {
    const circunscripcion = await this.circunscripcionRepository.findOne({
      where: { citrep },
    });

    if (!circunscripcion) {
      throw new NotFoundException(
        `Circunscripción con citrep ${citrep} no encontrada`,
      );
    }

    return this.toResponseDto(circunscripcion);
  }

  /**
   * Obtiene circunscripciones por departamento
   */
  async findByDepartamento(departamento: string): Promise<CircunscripcionResponseDto[]> {
    const circunscripciones = await this.circunscripcionRepository.find({
      where: { departamento },
      order: { citrep: 'ASC' },
    });

    return circunscripciones.map((circ) => this.toResponseDto(circ));
  }

  /**
   * Busca circunscripciones por citrep o departamento (búsqueda parcial)
   */
  async searchByNombre(nombre: string): Promise<CircunscripcionResponseDto[]> {
    const circunscripciones = await this.circunscripcionRepository
      .createQueryBuilder('circ')
      .where('LOWER(circ.citrep) LIKE LOWER(:nombre)', {
        nombre: `%${nombre}%`,
      })
      .orWhere('LOWER(circ.departamento) LIKE LOWER(:nombre)', {
        nombre: `%${nombre}%`,
      })
      .orderBy('circ.citrep', 'ASC')
      .getMany();

    return circunscripciones.map((circ) => this.toResponseDto(circ));
  }

  // ============ Personal Citrep ============

  /**
   * Obtiene todo el personal de citrep
   */
  async findAllPersonal(): Promise<PersonalCitrepResponseDto[]> {
    const personal = await this.personalCitrepRepository.find({
      order: { nombre: 'ASC' },
    });

    return personal.map((p) => this.toPersonalResponseDto(p));
  }

  /**
   * Obtiene personal por citrep
   */
  async findPersonalByCitrep(citrep: string): Promise<PersonalCitrepResponseDto[]> {
    const personal = await this.personalCitrepRepository.find({
      where: { citrep },
      order: { nombre: 'ASC' },
    });

    return personal.map((p) => this.toPersonalResponseDto(p));
  }

  /**
   * Obtiene personal por departamento
   */
  async findPersonalByDepartamento(departamento: string): Promise<PersonalCitrepResponseDto[]> {
    const personal = await this.personalCitrepRepository
      .createQueryBuilder('p')
      .where('LOWER(p.departamento) LIKE LOWER(:departamento)', {
        departamento: `%${departamento}%`,
      })
      .orderBy('p.nombre', 'ASC')
      .getMany();

    return personal.map((p) => this.toPersonalResponseDto(p));
  }

  /**
   * Obtiene resumen de personal por circunscripción
   */
  async getPersonalResumen(): Promise<PersonalCitrepResumenDto> {
    // Total de agentes
    const total = await this.personalCitrepRepository.count();
    
    // Total de circunscripciones distintas en la dimensión (COUNT DISTINCT citrep)
    const distinctCitrepResult = await this.circunscripcionRepository
      .createQueryBuilder('c')
      .select('COUNT(DISTINCT c.citrep)', 'total')
      .getRawOne();
    const totalCircunscripcionesDim = parseInt(distinctCitrepResult?.total || '0', 10);
    
    // Circunscripciones con agentes (distintas en la tabla de personal)
    const porCircunscripcion = await this.personalCitrepRepository
      .createQueryBuilder('p')
      .select('p.citrep', 'citrep')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('p.citrep')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Cantidad de circunscripciones que tienen al menos un agente
    const circunscripcionesConAgentes = porCircunscripcion.length;

    return {
      total_agentes: total,
      total_circunscripciones_dim: totalCircunscripcionesDim,
      total_circunscripciones_con_agentes: circunscripcionesConAgentes,
      por_circunscripcion: porCircunscripcion.map((item) => ({
        citrep: item.citrep,
        cantidad: parseInt(item.cantidad, 10),
      })),
    };
  }

  /**
   * Obtiene conteo de personal por circunscripción
   */
  async getPersonalPorCircunscripcion(): Promise<{ citrep: string; departamento: string; cantidad: number }[]> {
    const result = await this.personalCitrepRepository
      .createQueryBuilder('p')
      .select('p.citrep', 'citrep')
      .addSelect('p.departamento', 'departamento')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('p.citrep')
      .addGroupBy('p.departamento')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    return result.map((item) => ({
      citrep: item.citrep,
      departamento: item.departamento,
      cantidad: parseInt(item.cantidad, 10),
    }));
  }

  /**
   * Convierte entidad Circunscripcion a DTO de respuesta
   */
  private toResponseDto(circunscripcion: Circunscripcion): CircunscripcionResponseDto {
    return {
      id: circunscripcion.id,
      citrep: circunscripcion.citrep,
      departamento: circunscripcion.departamento,
      value: 0,
    };
  }

  /**
   * Convierte entidad PersonalCitrep a DTO de respuesta
   */
  private toPersonalResponseDto(personal: PersonalCitrep): PersonalCitrepResponseDto {
    return {
      id_personal_citrep: personal.id_personal_citrep,
      nro: personal.nro,
      cargo: personal.cargo,
      nombre: personal.nombre,
      seniority: personal.seniority,
      empresa: personal.empresa,
      citrep: personal.citrep,
      departamento: personal.departamento,
      municipio_principal: personal.municipio_principal,
      correo: personal.correo,
      celular: personal.celular,
      profesion: personal.profesion,
      estado: personal.estado,
    };
  }
}
