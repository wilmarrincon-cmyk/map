import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndicadorCargo } from './entities/indicador-cargo.entity';
import { IndicadorCargoResponseDto, ResumenIndicadoresCargosDto } from './dto/indicador-cargo.dto';

@Injectable()
export class IndicadoresCargosService {
  constructor(
    @InjectRepository(IndicadorCargo)
    private indicadorRepository: Repository<IndicadorCargo>,
  ) {}

  /**
   * Obtiene todos los indicadores
   */
  async findAll(): Promise<IndicadorCargoResponseDto[]> {
    const indicadores = await this.indicadorRepository.find({
      order: { cargo: 'ASC', indicador: 'ASC' },
    });

    return indicadores.map((indicador) => this.toResponseDto(indicador));
  }

  /**
   * Obtiene un indicador por ID
   */
  async findById(id_indicador: number): Promise<IndicadorCargoResponseDto> {
    const indicador = await this.indicadorRepository.findOne({
      where: { id_indicador },
    });

    if (!indicador) {
      throw new NotFoundException(`Indicador con ID ${id_indicador} no encontrado`);
    }

    return this.toResponseDto(indicador);
  }

  /**
   * Obtiene indicadores por cargo
   */
  async findByCargo(cargo: string): Promise<IndicadorCargoResponseDto[]> {
    const indicadores = await this.indicadorRepository
      .createQueryBuilder('i')
      .where('LOWER(i.cargo) LIKE LOWER(:cargo)', {
        cargo: `%${cargo}%`,
      })
      .orderBy('i.indicador', 'ASC')
      .getMany();

    return indicadores.map((indicador) => this.toResponseDto(indicador));
  }

  /**
   * Obtiene indicadores por resultado
   */
  async findByResultado(resultado: string): Promise<IndicadorCargoResponseDto[]> {
    const indicadores = await this.indicadorRepository.find({
      where: { resultado_enero: resultado },
      order: { cargo: 'ASC', indicador: 'ASC' },
    });

    return indicadores.map((indicador) => this.toResponseDto(indicador));
  }

  /**
   * Obtiene indicadores por frecuencia
   */
  async findByFrecuencia(frecuencia: string): Promise<IndicadorCargoResponseDto[]> {
    const indicadores = await this.indicadorRepository.find({
      where: { frecuencia },
      order: { cargo: 'ASC', indicador: 'ASC' },
    });

    return indicadores.map((indicador) => this.toResponseDto(indicador));
  }

  /**
   * Obtiene resumen general de indicadores
   */
  async getResumen(): Promise<ResumenIndicadoresCargosDto> {
    // Total de indicadores
    const total = await this.indicadorRepository.count();

    // Cargos distintos
    const cargosResult = await this.indicadorRepository
      .createQueryBuilder('i')
      .select('COUNT(DISTINCT i.cargo)', 'total')
      .getRawOne();
    const totalCargos = parseInt(cargosResult?.total || '0', 10);

    // Por cargo
    const porCargo = await this.indicadorRepository
      .createQueryBuilder('i')
      .select('i.cargo', 'cargo')
      .addSelect('COUNT(*)', 'cantidad')
      .where('i.cargo IS NOT NULL')
      .groupBy('i.cargo')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Por resultado
    const porResultado = await this.indicadorRepository
      .createQueryBuilder('i')
      .select('i.resultado_enero', 'resultado')
      .addSelect('COUNT(*)', 'cantidad')
      .where('i.resultado_enero IS NOT NULL')
      .groupBy('i.resultado_enero')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    // Por frecuencia
    const porFrecuencia = await this.indicadorRepository
      .createQueryBuilder('i')
      .select('i.frecuencia', 'frecuencia')
      .addSelect('COUNT(*)', 'cantidad')
      .where('i.frecuencia IS NOT NULL')
      .groupBy('i.frecuencia')
      .orderBy('i.frecuencia', 'ASC')
      .getRawMany();

    return {
      total_indicadores: total,
      total_cargos: totalCargos,
      por_cargo: porCargo.map((item) => ({
        cargo: item.cargo || 'Sin cargo',
        cantidad: parseInt(item.cantidad, 10),
      })),
      por_resultado: porResultado.map((item) => ({
        resultado: item.resultado || 'Sin resultado',
        cantidad: parseInt(item.cantidad, 10),
      })),
      por_frecuencia: porFrecuencia.map((item) => ({
        frecuencia: item.frecuencia || 'Sin frecuencia',
        cantidad: parseInt(item.cantidad, 10),
      })),
    };
  }

  /**
   * Obtiene lista de valores únicos para filtros
   */
  async getFilterOptions(): Promise<{
    cargos: string[];
    resultados: string[];
    frecuencias: string[];
    indicadores: string[];
  }> {
    const [cargos, resultados, frecuencias, indicadores] = await Promise.all([
      this.indicadorRepository
        .createQueryBuilder('i')
        .select('DISTINCT i.cargo', 'valor')
        .where('i.cargo IS NOT NULL')
        .orderBy('i.cargo', 'ASC')
        .getRawMany(),
      this.indicadorRepository
        .createQueryBuilder('i')
        .select('DISTINCT i.resultado_enero', 'valor')
        .where('i.resultado_enero IS NOT NULL')
        .orderBy('i.resultado_enero', 'ASC')
        .getRawMany(),
      this.indicadorRepository
        .createQueryBuilder('i')
        .select('DISTINCT i.frecuencia', 'valor')
        .where('i.frecuencia IS NOT NULL')
        .orderBy('i.frecuencia', 'ASC')
        .getRawMany(),
      this.indicadorRepository
        .createQueryBuilder('i')
        .select('DISTINCT i.indicador', 'valor')
        .where('i.indicador IS NOT NULL')
        .orderBy('i.indicador', 'ASC')
        .getRawMany(),
    ]);

    return {
      cargos: cargos.map((c) => c.valor),
      resultados: resultados.map((r) => r.valor),
      frecuencias: frecuencias.map((f) => f.valor),
      indicadores: indicadores.map((i) => i.valor),
    };
  }

  /**
   * Convierte entidad a DTO de respuesta
   */
  private toResponseDto(indicador: IndicadorCargo): IndicadorCargoResponseDto {
    return {
      id_indicador: indicador.id_indicador,
      cargo: indicador.cargo,
      indicador: indicador.indicador,
      descripcion: indicador.descripcion,
      formula: indicador.formula,
      meta_umbral: indicador.meta_umbral,
      unidad: indicador.unidad,
      frecuencia: indicador.frecuencia,
      resultado_enero: indicador.resultado_enero,
      fecha_registro: indicador.fecha_registro,
    };
  }
}
