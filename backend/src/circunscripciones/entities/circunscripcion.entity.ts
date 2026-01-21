import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'dim_circunscripcion', schema: 'report' })
export class Circunscripcion {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'citrep', type: 'varchar', length: 30 })
  citrep: string;

  @Column({ name: 'departamento', type: 'varchar', length: 50 })
  departamento: string;
}
