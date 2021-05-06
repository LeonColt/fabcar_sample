import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class Username {
    @ApiProperty()
    readonly username: string;
}

export class CreateCar {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly number: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly brand: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly model: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly color: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly owner: string;
}
