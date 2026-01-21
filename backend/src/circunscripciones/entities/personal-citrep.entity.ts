import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_personal_citrep', schema: 'report' })
export class PersonalCitrep {
  @PrimaryGeneratedColumn({ name: 'id_personal_citrep', type: 'int' })
  id_personal_citrep: number;

  @Column({ name: 'nro', type: 'int' })
  nro: number;

  @Column({ name: 'cargo', type: 'varchar', length: 100 })
  cargo: string;

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string;

  @Column({ name: 'seniority', type: 'varchar', length: 50, nullable: true })
  seniority: string;

  @Column({ name: 'empresa', type: 'varchar', length: 100, nullable: true })
  empresa: string;

  @Column({ name: 'citrep', type: 'varchar', length: 30 })
  citrep: string;

  @Column({ name: 'departamento', type: 'varchar', length: 50 })
  departamento: string;

  @Column({ name: 'municipio_principal', type: 'varchar', length: 100, nullable: true })
  municipio_principal: string;

  @Column({ name: 'ticket', type: 'varchar', length: 50, nullable: true })
  ticket: string;

  @Column({ name: 'fecha_ingreso', type: 'date', nullable: true })
  fecha_ingreso: Date;

  @Column({ name: 'hv_drive', type: 'text', nullable: true })
  hv_drive: string;

  @Column({ name: 'correo', type: 'text', nullable: true })
  correo: string;

  @Column({ name: 'celular', type: 'text', nullable: true })
  celular: string;

  @Column({ name: 'profesion', type: 'varchar', length: 100, nullable: true })
  profesion: string;

  @Column({ name: 'estado', type: 'varchar', length: 50, nullable: true })
  estado: string;

  @Column({ name: 'observacion', type: 'text', nullable: true })
  observacion: string;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  fecha_creacion: Date;
}
