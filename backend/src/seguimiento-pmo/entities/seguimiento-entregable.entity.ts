import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tbl_seguimiento_entregables', schema: 'report' })
export class SeguimientoEntregable {
  @PrimaryColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'tipo', type: 'varchar', length: 50, nullable: true })
  tipo: string;

  @Column({ name: 'componente', type: 'text', nullable: true })
  componente: string;

  @Column({ name: 'actividad', type: 'text', nullable: true })
  actividad: string;

  @Column({ name: 'fecha_inicio', type: 'date', nullable: true })
  fecha_inicio: Date;

  @Column({ name: 'fecha_final', type: 'date', nullable: true })
  fecha_final: Date;

  @Column({ name: 'fecha_final_numerica', type: 'date', nullable: true })
  fecha_final_numerica: Date;

  @Column({ name: 'fecha_real_ejecucion', type: 'date', nullable: true })
  fecha_real_ejecucion: Date;

  @Column({ name: 'fecha_real_ejecucion_numerica', type: 'date', nullable: true })
  fecha_real_ejecucion_numerica: Date;

  @Column({ name: 'estado_actividad_plazo', type: 'varchar', length: 50, nullable: true })
  estado_actividad_plazo: string;

  @Column({ name: 'tipo_eleccion', type: 'varchar', length: 100, nullable: true })
  tipo_eleccion: string;

  @Column({ name: 'cortes_contractuales', type: 'text', nullable: true })
  cortes_contractuales: string;

  @Column({ name: 'responsable_principal', type: 'varchar', length: 150, nullable: true })
  responsable_principal: string;

  @Column({ name: 'encargado', type: 'text', nullable: true })
  encargado: string;

  @Column({ name: 'estado_actividad_plazo_seguimiento', type: 'varchar', length: 50, nullable: true })
  estado_actividad_plazo_seguimiento: string;

  @Column({ name: 'estado_actividad_ejecucion', type: 'varchar', length: 50, nullable: true })
  estado_actividad_ejecucion: string;

  @Column({ name: 'evidencia_recibida', type: 'text', nullable: true })
  evidencia_recibida: string;

  @Column({ name: 'notas', type: 'text', nullable: true })
  notas: string;

  @Column({ name: 'evidencia_contractual_requerida', type: 'text', nullable: true })
  evidencia_contractual_requerida: string;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  fecha_creacion: Date;
}
