import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'Exercise name cannot be blank' })
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
