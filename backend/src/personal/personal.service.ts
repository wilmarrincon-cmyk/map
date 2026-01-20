import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Personal } from './entities/personal.entity';
import { PersonalResponseDto, PersonalPorDepartamentoDto, ResumenAgentesDto } from './dto/personal.dto';

@Injectable()
export class PersonalService {
  constructor(
    @InjectRepository(Personal)
    private personalRepository: Repository<Personal>,
  ) {}

  /**
   * Obtiene todo el personal
   */
  async findAll(): Promise<PersonalResponseDto[]> {
    const personal = await this.personalRepository.find({
      order: { departamento: 'ASC', nombre: 'ASC' },
    });

    return personal.map((p) => this.toResponseDto(p));
  }

  /**
   * Obtiene personal por departamento
   */
  async findByDepartamento(departamento: string): Promise<PersonalResponseDto[]> {
    const personal = await this.personalRepository
      .createQueryBuilder('p')
      .where('UPPER(p.departamento) = UPPER(:departamento)', { departamento })
      .orderBy('p.nombre', 'ASC')
      .getMany();

    return personal.map((p) => this.toResponseDto(p));
  }

  /**
   * Obtiene el conteo de agentes por departamento
   */
  async getConteoPorDepartamento(): Promise<{ departamento: string; cantidad: number }[]> {
    const result = await this.personalRepository
      .createQueryBuilder('p')
      .select('p.departamento', 'departamento')
      .addSelect('COUNT(*)', 'cantidad')
      .where('p.departamento IS NOT NULL')
      .groupBy('p.departamento')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    return result.map((r) => ({
      departamento: r.departamento,
      cantidad: parseInt(r.cantidad, 10),
    }));
  }

  /**
   * Obtiene resumen general de agentes
   */
  async getResumen(): Promise<ResumenAgentesDto> {
    const totalAgentes = await this.personalRepository.count();
    
    const porDepartamento = await this.getConteoPorDepartamento();
    
    return {
      total_agentes: totalAgentes,
      total_departamentos: porDepartamento.length,
      por_departamento: porDepartamento,
    };
  }

  /**
   * Obtiene personal agrupado por departamento
   */
  async getAgrupadoPorDepartamento(): Promise<PersonalPorDepartamentoDto[]> {
    const personal = await this.personalRepository.find({
      order: { departamento: 'ASC', nombre: 'ASC' },
    });

    const grupos = new Map<string, Personal[]>();
    
    personal.forEach((p) => {
      const dept = p.departamento || 'Sin asignar';
      if (!grupos.has(dept)) {
        grupos.set(dept, []);
      }
      grupos.get(dept)!.push(p);
    });

    return Array.from(grupos.entries()).map(([departamento, agentes]) => ({
      departamento,
      total_agentes: agentes.length,
      agentes: agentes.map((a) => this.toResponseDto(a)),
    }));
  }

  private toResponseDto(personal: Personal): PersonalResponseDto {
    return {
      id_personal: personal.id_personal,
      nro: personal.nro,
      cargo: personal.cargo,
      nombre: personal.nombre,
      departamento: personal.departamento,
      roles: personal.roles,
      celular: personal.celular,
      correo: personal.correo,
      profesion: personal.profesion,
      seniority: personal.seniority,
      empresa: personal.empresa,
    };
  }
}
