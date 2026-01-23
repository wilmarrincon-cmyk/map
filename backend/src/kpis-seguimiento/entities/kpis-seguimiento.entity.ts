import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_kpis_seguimiento', schema: 'report' })
export class KpisSeguimiento {
  @PrimaryGeneratedColumn({ name: 'id_kpi', type: 'int' })
  id_kpi: number;

  @Column({ name: 'componente', type: 'varchar', length: 150 })
  componente: string;

  @Column({ name: 'kpi_nombre', type: 'text' })
  kpi_nombre: string;

  @Column({ name: 'objetivo', type: 'text', nullable: true })
  objetivo: string;

  @Column({ name: 'que_responde', type: 'text', nullable: true })
  que_responde: string;

  @Column({ name: 'que_mide', type: 'text', nullable: true })
  que_mide: string;

  @Column({ name: 'base_contractual', type: 'text', nullable: true })
  base_contractual: string;

  @Column({ name: 'formula', type: 'text', nullable: true })
  formula: string;

  @Column({ name: 'unidad', type: 'varchar', length: 50, nullable: true })
  unidad: string;

  @Column({ name: 'fuente', type: 'text', nullable: true })
  fuente: string;

  @Column({ name: 'frecuencia', type: 'varchar', length: 100, nullable: true })
  frecuencia: string;

  @Column({ name: 'meta_umbral', type: 'text', nullable: true })
  meta_umbral: string;

  @Column({ name: 'resultado', type: 'varchar', length: 50, nullable: true })
  resultado: string;

  @Column({ name: 'responsable_dato', type: 'varchar', length: 150, nullable: true })
  responsable_dato: string;

  @Column({ name: 'ultima_fecha_reporte', type: 'text', nullable: true })
  ultima_fecha_reporte: string;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  fecha_creacion: Date;

  @Column({ name: 'fecha_actualizacion', type: 'timestamp', nullable: true })
  fecha_actualizacion: Date;
}
