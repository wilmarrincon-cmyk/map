import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_personal_territorio', schema: 'report' })
export class Personal {
  @PrimaryGeneratedColumn({ name: 'id_personal', type: 'bigint' })
  id_personal: number;

  @Column({ name: 'nro', type: 'int', nullable: true })
  nro: number;

  @Column({ name: 'cargo', type: 'varchar', length: 150, nullable: true })
  cargo: string;

  @Column({ name: 'nombre', type: 'varchar', length: 200, nullable: true })
  nombre: string;

  @Column({ name: 'departamento', type: 'varchar', length: 100, nullable: true })
  departamento: string;

  @Column({ name: 'roles', type: 'text', nullable: true })
  roles: string;

  @Column({ name: 'celular', type: 'varchar', length: 100, nullable: true })
  celular: string;

  @Column({ name: 'correo', type: 'varchar', length: 255, nullable: true })
  correo: string;

  @Column({ name: 'documentacion', type: 'varchar', length: 50, nullable: true })
  documentacion: string;

  @Column({ name: 'observacion', type: 'text', nullable: true })
  observacion: string;

  @Column({ name: 'profesion', type: 'varchar', length: 150, nullable: true })
  profesion: string;

  @Column({ name: 'seniority', type: 'varchar', length: 50, nullable: true })
  seniority: string;

  @Column({ name: 'empresa', type: 'varchar', length: 150, nullable: true })
  empresa: string;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'now()' })
  fecha_creacion: Date;
}
