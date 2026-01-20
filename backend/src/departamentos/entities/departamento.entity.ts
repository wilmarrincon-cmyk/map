import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'dim_departamento', schema: 'report' })
export class Departamento {
  @PrimaryColumn({ name: 'codigo_dane', type: 'integer' })
  codigo_dane: number;

  @Column({ name: 'codigo', type: 'varchar', length: 10, unique: true })
  codigo: string;

  @Column({ name: 'departamento', type: 'varchar', length: 100 })
  departamento: string;

  @Column({ name: 'latitud', type: 'numeric', precision: 10, scale: 6, nullable: true })
  latitud: number;

  @Column({ name: 'longitud', type: 'numeric', precision: 10, scale: 6, nullable: true })
  longitud: number;
}
