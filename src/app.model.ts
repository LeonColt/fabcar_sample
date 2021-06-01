import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

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

export class CarTransfer {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly number: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly newOwner: string;
}

export class CreateCarFinance {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly carId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(1000000)
    readonly payPerMonth: number;
}

export class CreateCarFinancePayment {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly financeId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    @Min(1000000)
    readonly payment: number;
}

export class Car {
    @ApiProperty()
    readonly id: string;

    @ApiProperty()
    readonly color: string;

    @ApiProperty()
    readonly make: string;

    @ApiProperty()
    readonly model: string;

    @ApiProperty()
    readonly inFinance: boolean;

    @ApiProperty()
    readonly owner: string;

    @ApiProperty()
    readonly price: number;
}
