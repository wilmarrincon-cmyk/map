import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KpiControlGerencia } from './entities/kpi-control-gerencia.entity';
import { KpiControlGerenciaResponseDto, ResumenKpisControlGerenciaDto } from './dto/kpi-control-gerencia.dto';

@Injectable()
export class KpisControlGerenciaService {
  constructor(
    @InjectRepository(KpiControlGerencia)
    private kpiRepository: Repository<KpiControlGerencia>,
  ) {}

  /**
   * Obtiene todos los KPIs
   */
  async findAll(): Promise<KpiControlGerenciaResponseDto[]> {
    const kpis = await this.kpiRepository.find({
      order: { kpi: 'ASC' },
    });

    return kpis.map((kpi) => this.toResponseDto(kpi));
  }

  /**
   * Obtiene un KPI por ID
   */
  async findById(id_kpi: number): Promise<KpiControlGerenciaResponseDto> {
    const kpi = await this.kpiRepository.findOne({
      where: { id_kpi },
    });

    if (!kpi) {
      throw new NotFoundException(`KPI con ID ${id_kpi} no encontrado`);
    }

    return this.toResponseDto(kpi);
  }

  /**
   * Obtiene KPIs por estado
   */
  async findByEstado(estado: string): Promise<KpiControlGerenciaResponseDto[]> {
    const kpis = await this.kpiRepository.find({
      where: { estado },
      order: { kpi: 'ASC' },
    });

    return kpis.map((kpi) => this.toResponseDto(kpi));
  }

  /**
   * Obtiene KPIs por periodicidad
   */
  async findByPeriodicidad(periodicidad: string): Promise<KpiControlGerenciaResponseDto[]> {
    const kpis = await this.kpiRepository.find({
      where: { periodicidad },
      order: { kpi: 'ASC' },
    });

    return kpis.map((kpi) => this.toResponseDto(kpi));
  }

  /**
   * Obtiene KPIs por responsable
   */
  async findByResponsable(responsable: string): Promise<KpiControlGerenciaResponseDto[]> {
    const kpis = await this.kpiRepository
      .createQueryBuilder('k')
      .where('LOWER(k.responsable) LIKE LOWER(:responsable)', {
        responsable: `%${responsable}%`,
      })
      .orderBy('k.kpi', 'ASC')
      .getMany();

    return kpis.map((kpi) => this.toResponseDto(kpi));
  }

  /**
   * Obtiene resumen general de KPIs
   */
  async getResumen(): Promise<ResumenKpisControlGerenciaDto> {
    // Total de KPIs
    const total = await this.kpiRepository.count();

    // Por estado
    const porEstado = await this.kpiRepository
      .createQueryBuilder('k')
      .select('k.estado', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .where('k.estado IS NOT NULL')
      .groupBy('k.estado')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Por periodicidad
    const porPeriodicidad = await this.kpiRepository
      .createQueryBuilder('k')
      .select('k.periodicidad', 'periodicidad')
      .addSelect('COUNT(*)', 'cantidad')
      .where('k.periodicidad IS NOT NULL')
      .groupBy('k.periodicidad')
      .orderBy('k.periodicidad', 'ASC')
      .getRawMany();

    // Por responsable
    const porResponsable = await this.kpiRepository
      .createQueryBuilder('k')
      .select('k.responsable', 'responsable')
      .addSelect('COUNT(*)', 'cantidad')
      .where('k.responsable IS NOT NULL')
      .groupBy('k.responsable')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    return {
      total_kpis: total,
      por_estado: porEstado.map((item) => ({
        estado: item.estado || 'Sin estado',
        cantidad: parseInt(item.cantidad, 10),
      })),
      por_periodicidad: porPeriodicidad.map((item) => ({
        periodicidad: item.periodicidad || 'Sin periodicidad',
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
    estados: string[];
    periodicidades: string[];
    responsables: string[];
    kpis: string[];
  }> {
    const [estados, periodicidades, responsables, kpis] = await Promise.all([
      this.kpiRepository
        .createQueryBuilder('k')
        .select('DISTINCT k.estado', 'valor')
        .where('k.estado IS NOT NULL')
        .orderBy('k.estado', 'ASC')
        .getRawMany(),
      this.kpiRepository
        .createQueryBuilder('k')
        .select('DISTINCT k.periodicidad', 'valor')
        .where('k.periodicidad IS NOT NULL')
        .orderBy('k.periodicidad', 'ASC')
        .getRawMany(),
      this.kpiRepository
        .createQueryBuilder('k')
        .select('DISTINCT k.responsable', 'valor')
        .where('k.responsable IS NOT NULL')
        .orderBy('k.responsable', 'ASC')
        .getRawMany(),
      this.kpiRepository
        .createQueryBuilder('k')
        .select('DISTINCT k.kpi', 'valor')
        .where('k.kpi IS NOT NULL')
        .orderBy('k.kpi', 'ASC')
        .getRawMany(),
    ]);

    return {
      estados: estados.map((e) => e.valor),
      periodicidades: periodicidades.map((p) => p.valor),
      responsables: responsables.map((r) => r.valor),
      kpis: kpis.map((k) => k.valor),
    };
  }

  /**
   * Convierte entidad a DTO de respuesta
   */
  private toResponseDto(kpi: KpiControlGerencia): KpiControlGerenciaResponseDto {
    return {
      id_kpi: kpi.id_kpi,
      kpi: kpi.kpi,
      descripcion: kpi.descripcion,
      formula_metodo: kpi.formula_metodo,
      meta: kpi.meta,
      resultado_actual: kpi.resultado_actual,
      estado: kpi.estado,
      periodicidad: kpi.periodicidad,
      responsable: kpi.responsable,
      fecha_actualizacion: kpi.fecha_actualizacion,
    };
  }
}
