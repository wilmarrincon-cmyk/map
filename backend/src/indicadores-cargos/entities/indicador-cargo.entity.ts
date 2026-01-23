import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_indicadores_desempeno_cargos', schema: 'report' })
export class IndicadorCargo {
  @PrimaryGeneratedColumn({ name: 'id_indicador', type: 'int' })
  id_indicador: number;

  @Column({ name: 'cargo', type: 'varchar', length: 120 })
  cargo: string;

  @Column({ name: 'indicador', type: 'varchar', length: 200 })
  indicador: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'formula', type: 'text', nullable: true })
  formula: string;

  @Column({ name: 'meta_umbral', type: 'text', nullable: true })
  meta_umbral: string;

  @Column({ name: 'unidad', type: 'varchar', length: 50, nullable: true })
  unidad: string;

  @Column({ name: 'frecuencia', type: 'varchar', length: 50, nullable: true })
  frecuencia: string;

  @Column({ name: 'resultado_enero', type: 'varchar', length: 50, nullable: true })
  resultado_enero: string;

  @Column({ name: 'fecha_registro', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  fecha_registro: Date;
}
