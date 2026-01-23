import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_kpis_control_gerencia', schema: 'report' })
export class KpiControlGerencia {
  @PrimaryGeneratedColumn({ name: 'id_kpi', type: 'int' })
  id_kpi: number;

  @Column({ name: 'kpi', type: 'varchar', length: 150 })
  kpi: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'formula_metodo', type: 'text', nullable: true })
  formula_metodo: string;

  @Column({ name: 'meta', type: 'varchar', length: 50, nullable: true })
  meta: string;

  @Column({ name: 'resultado_actual', type: 'varchar', length: 50, nullable: true })
  resultado_actual: string;

  @Column({ name: 'estado', type: 'varchar', length: 30, nullable: true })
  estado: string;

  @Column({ name: 'periodicidad', type: 'varchar', length: 50, nullable: true })
  periodicidad: string;

  @Column({ name: 'responsable', type: 'varchar', length: 100, nullable: true })
  responsable: string;

  @Column({ name: 'fecha_actualizacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  fecha_actualizacion: Date;
}
