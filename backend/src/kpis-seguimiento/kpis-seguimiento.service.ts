import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KpisSeguimiento } from './entities/kpis-seguimiento.entity';
import { KpiSeguimientoResponseDto, ResumenKpisDto } from './dto/kpis-seguimiento.dto';

@Injectable()
export class KpisSeguimientoService {
  constructor(
    @InjectRepository(KpisSeguimiento)
    private kpisRepository: Repository<KpisSeguimiento>,
  ) {}

  /**
   * Obtiene todos los KPIs
   */
  async findAll(): Promise<KpiSeguimientoResponseDto[]> {
    const kpis = await this.kpisRepository.find({
      order: { componente: 'ASC', kpi_nombre: 'ASC' },
    });

    return kpis.map((kpi) => this.toResponseDto(kpi));
  }

  /**
   * Obtiene un KPI por ID
   */
  async findById(id_kpi: number): Promise<KpiSeguimientoResponseDto> {
    const kpi = await this.kpisRepository.findOne({
      where: { id_kpi },
    });

    if (!kpi) {
      throw new NotFoundException(`KPI con ID ${id_kpi} no encontrado`);
    }

    return this.toResponseDto(kpi);
  }

  /**
   * Obtiene KPIs por componente
   */
  async findByComponente(componente: string): Promise<KpiSeguimientoResponseDto[]> {
    const kpis = await this.kpisRepository
      .createQueryBuilder('k')
      .where('LOWER(k.componente) LIKE LOWER(:componente)', {
        componente: `%${componente}%`,
      })
      .orderBy('k.kpi_nombre', 'ASC')
      .getMany();

    return kpis.map((kpi) => this.toResponseDto(kpi));
  }

  /**
   * Obtiene KPIs por resultado
   */
  async findByResultado(resultado: string): Promise<KpiSeguimientoResponseDto[]> {
    const kpis = await this.kpisRepository.find({
      where: { resultado },
      order: { componente: 'ASC', kpi_nombre: 'ASC' },
    });

    return kpis.map((kpi) => this.toResponseDto(kpi));
  }

  /**
   * Obtiene KPIs por frecuencia
   */
  async findByFrecuencia(frecuencia: string): Promise<KpiSeguimientoResponseDto[]> {
    const kpis = await this.kpisRepository.find({
      where: { frecuencia },
      order: { componente: 'ASC', kpi_nombre: 'ASC' },
    });

    return kpis.map((kpi) => this.toResponseDto(kpi));
  }

  /**
   * Obtiene resumen general de KPIs
   */
  async getResumen(): Promise<ResumenKpisDto> {
    // Total de KPIs
    const total = await this.kpisRepository.count();

    // Componentes distintos
    const componentesResult = await this.kpisRepository
      .createQueryBuilder('k')
      .select('COUNT(DISTINCT k.componente)', 'total')
      .getRawOne();
    const totalComponentes = parseInt(componentesResult?.total || '0', 10);

    // Por componente
    const porComponente = await this.kpisRepository
      .createQueryBuilder('k')
      .select('k.componente', 'componente')
      .addSelect('COUNT(*)', 'cantidad')
      .where('k.componente IS NOT NULL')
      .groupBy('k.componente')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Por resultado
    const porResultado = await this.kpisRepository
      .createQueryBuilder('k')
      .select('k.resultado', 'resultado')
      .addSelect('COUNT(*)', 'cantidad')
      .where('k.resultado IS NOT NULL')
      .groupBy('k.resultado')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Por frecuencia
    const porFrecuencia = await this.kpisRepository
      .createQueryBuilder('k')
      .select('k.frecuencia', 'frecuencia')
      .addSelect('COUNT(*)', 'cantidad')
      .where('k.frecuencia IS NOT NULL')
      .groupBy('k.frecuencia')
      .orderBy('k.frecuencia', 'ASC')
      .getRawMany();

    return {
      total_kpis: total,
      total_componentes: totalComponentes,
      por_componente: porComponente.map((item) => ({
        componente: item.componente || 'Sin componente',
        cantidad: parseInt(item.cantidad, 10),
        promedio_cumplimiento: 0, // No aplica con la nueva estructura
      })),
      por_estado: porResultado.map((item) => ({
        estado: item.resultado || 'Sin resultado',
        cantidad: parseInt(item.cantidad, 10),
      })),
      por_periodo: porFrecuencia.map((item) => ({
        periodo: item.frecuencia || 'Sin frecuencia',
        cantidad: parseInt(item.cantidad, 10),
      })),
      kpis_por_encima_meta: 0, // No aplica con la nueva estructura
      kpis_por_debajo_meta: 0, // No aplica con la nueva estructura
    };
  }

  /**
   * Obtiene lista de valores únicos para filtros
   */
  async getFilterOptions(): Promise<{
    componentes: string[];
    resultados: string[];
    frecuencias: string[];
    kpi_nombres: string[];
  }> {
    const [componentes, resultados, frecuencias, kpiNombres] = await Promise.all([
      this.kpisRepository
        .createQueryBuilder('k')
        .select('DISTINCT k.componente', 'valor')
        .where('k.componente IS NOT NULL')
        .orderBy('k.componente', 'ASC')
        .getRawMany(),
      this.kpisRepository
        .createQueryBuilder('k')
        .select('DISTINCT k.resultado', 'valor')
        .where('k.resultado IS NOT NULL')
        .orderBy('k.resultado', 'ASC')
        .getRawMany(),
      this.kpisRepository
        .createQueryBuilder('k')
        .select('DISTINCT k.frecuencia', 'valor')
        .where('k.frecuencia IS NOT NULL')
        .orderBy('k.frecuencia', 'ASC')
        .getRawMany(),
      this.kpisRepository
        .createQueryBuilder('k')
        .select('DISTINCT k.kpi_nombre', 'valor')
        .where('k.kpi_nombre IS NOT NULL')
        .orderBy('k.kpi_nombre', 'ASC')
        .getRawMany(),
    ]);

    return {
      componentes: componentes.map((c) => c.valor),
      resultados: resultados.map((r) => r.valor),
      frecuencias: frecuencias.map((f) => f.valor),
      kpi_nombres: kpiNombres.map((k) => k.valor),
    };
  }

  /**
   * Convierte entidad a DTO de respuesta
   */
  private toResponseDto(kpi: KpisSeguimiento): KpiSeguimientoResponseDto {
    return {
      id_kpi: kpi.id_kpi,
      componente: kpi.componente,
      kpi_nombre: kpi.kpi_nombre,
      objetivo: kpi.objetivo,
      que_responde: kpi.que_responde,
      que_mide: kpi.que_mide,
      base_contractual: kpi.base_contractual,
      formula: kpi.formula,
      unidad: kpi.unidad,
      fuente: kpi.fuente,
      frecuencia: kpi.frecuencia,
      meta_umbral: kpi.meta_umbral,
      resultado: kpi.resultado,
      responsable_dato: kpi.responsable_dato,
      ultima_fecha_reporte: kpi.ultima_fecha_reporte,
      fecha_creacion: kpi.fecha_creacion,
      fecha_actualizacion: kpi.fecha_actualizacion,
    };
  }
}
