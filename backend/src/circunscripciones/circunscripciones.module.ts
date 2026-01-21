import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CircunscripcionesController } from './circunscripciones.controller';
import { CircunscripcionesService } from './circunscripciones.service';
import { Circunscripcion } from './entities/circunscripcion.entity';
import { PersonalCitrep } from './entities/personal-citrep.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Circunscripcion, PersonalCitrep])],
  controllers: [CircunscripcionesController],
  providers: [CircunscripcionesService],
  exports: [CircunscripcionesService],
})
export class CircunscripcionesModule {}
