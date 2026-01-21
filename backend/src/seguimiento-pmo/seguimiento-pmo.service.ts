import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeguimientoEntregable } from './entities/seguimiento-entregable.entity';
import { EntregableResponseDto, ResumenPMODto } from './dto/seguimiento-pmo.dto';

@Injectable()
export class SeguimientoPmoService {
  constructor(
    @InjectRepository(SeguimientoEntregable)
    private entregableRepository: Repository<SeguimientoEntregable>,
  ) {}

  /**
   * Obtiene todos los entregables
   */
  async findAll(): Promise<EntregableResponseDto[]> {
    const entregables = await this.entregableRepository.find({
      order: { id: 'ASC' },
    });

    return entregables.map((e) => this.toResponseDto(e));
  }

  /**
   * Obtiene un entregable por ID
   */
  async findById(id: number): Promise<EntregableResponseDto> {
    const entregable = await this.entregableRepository.findOne({
      where: { id },
    });

    if (!entregable) {
      throw new NotFoundException(`Entregable con ID ${id} no encontrado`);
    }

    return this.toResponseDto(entregable);
  }

  /**
   * Obtiene entregables por tipo
   */
  async findByTipo(tipo: string): Promise<EntregableResponseDto[]> {
    const entregables = await this.entregableRepository.find({
      where: { tipo },
      order: { id: 'ASC' },
    });

    return entregables.map((e) => this.toResponseDto(e));
  }

  /**
   * Obtiene entregables por componente
   */
  async findByComponente(componente: string): Promise<EntregableResponseDto[]> {
    const entregables = await this.entregableRepository
      .createQueryBuilder('e')
      .where('LOWER(e.componente) LIKE LOWER(:componente)', {
        componente: `%${componente}%`,
      })
      .orderBy('e.id', 'ASC')
      .getMany();

    return entregables.map((e) => this.toResponseDto(e));
  }

  /**
   * Obtiene entregables por estado de plazo
   */
  async findByEstadoPlazo(estado: string): Promise<EntregableResponseDto[]> {
    const entregables = await this.entregableRepository.find({
      where: { estado_actividad_plazo: estado },
      order: { id: 'ASC' },
    });

    return entregables.map((e) => this.toResponseDto(e));
  }

  /**
   * Obtiene entregables por estado de ejecución
   */
  async findByEstadoEjecucion(estado: string): Promise<EntregableResponseDto[]> {
    const entregables = await this.entregableRepository.find({
      where: { estado_actividad_ejecucion: estado },
      order: { id: 'ASC' },
    });

    return entregables.map((e) => this.toResponseDto(e));
  }

  /**
   * Obtiene entregables por responsable
   */
  async findByResponsable(responsable: string): Promise<EntregableResponseDto[]> {
    const entregables = await this.entregableRepository
      .createQueryBuilder('e')
      .where('LOWER(e.responsable_principal) LIKE LOWER(:responsable)', {
        responsable: `%${responsable}%`,
      })
      .orderBy('e.id', 'ASC')
      .getMany();

    return entregables.map((e) => this.toResponseDto(e));
  }

  /**
   * Obtiene resumen general del PMO
   */
  async getResumen(): Promise<ResumenPMODto> {
    // Total de entregables
    const total = await this.entregableRepository.count();

    // Componentes distintos
    const componentesResult = await this.entregableRepository
      .createQueryBuilder('e')
      .select('COUNT(DISTINCT e.componente)', 'total')
      .getRawOne();
    const totalComponentes = parseInt(componentesResult?.total || '0', 10);

    // Por estado de plazo
    const porEstadoPlazo = await this.entregableRepository
      .createQueryBuilder('e')
      .select('e.estado_actividad_plazo', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .where('e.estado_actividad_plazo IS NOT NULL')
      .groupBy('e.estado_actividad_plazo')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Por estado de ejecución
    const porEstadoEjecucion = await this.entregableRepository
      .createQueryBuilder('e')
      .select('e.estado_actividad_ejecucion', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .where('e.estado_actividad_ejecucion IS NOT NULL')
      .groupBy('e.estado_actividad_ejecucion')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Por componente
    const porComponente = await this.entregableRepository
      .createQueryBuilder('e')
      .select('e.componente', 'componente')
      .addSelect('COUNT(*)', 'cantidad')
      .where('e.componente IS NOT NULL')
      .groupBy('e.componente')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Por tipo
    const porTipo = await this.entregableRepository
      .createQueryBuilder('e')
      .select('e.tipo', 'tipo')
      .addSelect('COUNT(*)', 'cantidad')
      .where('e.tipo IS NOT NULL')
      .groupBy('e.tipo')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Por responsable
    const porResponsable = await this.entregableRepository
      .createQueryBuilder('e')
      .select('e.responsable_principal', 'responsable')
      .addSelect('COUNT(*)', 'cantidad')
      .where('e.responsable_principal IS NOT NULL')
      .groupBy('e.responsable_principal')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    return {
      total_entregables: total,
      total_componentes: totalComponentes,
      por_estado_plazo: porEstadoPlazo.map((item) => ({
        estado: item.estado || 'Sin estado',
        cantidad: parseInt(item.cantidad, 10),
      })),
      por_estado_ejecucion: porEstadoEjecucion.map((item) => ({
        estado: item.estado || 'Sin estado',
        cantidad: parseInt(item.cantidad, 10),
      })),
      por_componente: porComponente.map((item) => ({
        componente: item.componente || 'Sin componente',
        cantidad: parseInt(item.cantidad, 10),
      })),
      por_tipo: porTipo.map((item) => ({
        tipo: item.tipo || 'Sin tipo',
        cantidad: parseInt(item.cantidad, 10),
      })),
      por_responsable: porResponsable.map((item) => ({
        responsable: item.responsable || 'Sin responsable',
        cantidad: parseInt(item.cantidad, 10),
      })),
    };
  }

  /**
   * Obtiene lista de valores únicos para filtros
   */
  async getFilterOptions(): Promise<{
    tipos: string[];
    componentes: string[];
    estados_plazo: string[];
    estados_ejecucion: string[];
    responsables: string[];
    tipos_eleccion: string[];
  }> {
    const [tipos, componentes, estadosPlazo, estadosEjecucion, responsables, tiposEleccion] = await Promise.all([
      this.entregableRepository
        .createQueryBuilder('e')
        .select('DISTINCT e.tipo', 'valor')
        .where('e.tipo IS NOT NULL')
        .orderBy('e.tipo', 'ASC')
        .getRawMany(),
      this.entregableRepository
        .createQueryBuilder('e')
        .select('DISTINCT e.componente', 'valor')
        .where('e.componente IS NOT NULL')
        .orderBy('e.componente', 'ASC')
        .getRawMany(),
      this.entregableRepository
        .createQueryBuilder('e')
        .select('DISTINCT e.estado_actividad_plazo', 'valor')
        .where('e.estado_actividad_plazo IS NOT NULL')
        .orderBy('e.estado_actividad_plazo', 'ASC')
        .getRawMany(),
      this.entregableRepository
        .createQueryBuilder('e')
        .select('DISTINCT e.estado_actividad_ejecucion', 'valor')
        .where('e.estado_actividad_ejecucion IS NOT NULL')
        .orderBy('e.estado_actividad_ejecucion', 'ASC')
        .getRawMany(),
      this.entregableRepository
        .createQueryBuilder('e')
        .select('DISTINCT e.responsable_principal', 'valor')
        .where('e.responsable_principal IS NOT NULL')
        .orderBy('e.responsable_principal', 'ASC')
        .getRawMany(),
      this.entregableRepository
        .createQueryBuilder('e')
        .select('DISTINCT e.tipo_eleccion', 'valor')
        .where('e.tipo_eleccion IS NOT NULL')
        .orderBy('e.tipo_eleccion', 'ASC')
        .getRawMany(),
    ]);

    return {
      tipos: tipos.map((t) => t.valor),
      componentes: componentes.map((c) => c.valor),
      estados_plazo: estadosPlazo.map((e) => e.valor),
      estados_ejecucion: estadosEjecucion.map((e) => e.valor),
      responsables: responsables.map((r) => r.valor),
      tipos_eleccion: tiposEleccion.map((t) => t.valor),
    };
  }

  /**
   * Convierte entidad a DTO de respuesta
   */
  private toResponseDto(entregable: SeguimientoEntregable): EntregableResponseDto {
    return {
      id: entregable.id,
      tipo: entregable.tipo,
      componente: entregable.componente,
      actividad: entregable.actividad,
      fecha_inicio: entregable.fecha_inicio,
      fecha_final: entregable.fecha_final,
      fecha_real_ejecucion: entregable.fecha_real_ejecucion,
      estado_actividad_plazo: entregable.estado_actividad_plazo,
      tipo_eleccion: entregable.tipo_eleccion,
      cortes_contractuales: entregable.cortes_contractuales,
      responsable_principal: entregable.responsable_principal,
      encargado: entregable.encargado,
      estado_actividad_plazo_seguimiento: entregable.estado_actividad_plazo_seguimiento,
      estado_actividad_ejecucion: entregable.estado_actividad_ejecucion,
      evidencia_recibida: entregable.evidencia_recibida,
      notas: entregable.notas,
    };
  }
}
