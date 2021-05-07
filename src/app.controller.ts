import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CarTransfer, CreateCar, Username } from './app.model';
import { AppService } from './app.service';

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Register Admin" })
  @ApiNoContentResponse({ description: "Register admin success" })
  @ApiConflictResponse({ description: "Admin already registered" })
  @HttpCode( HttpStatus.NO_CONTENT )
  @Post("register/admin")
  async registerAdmin() {
    await this.appService.registerAdmin();
  }

  @ApiOperation({ summary: "Register User" })
  @ApiNoContentResponse({ description: "Register user success" })
  @ApiConflictResponse({ description: "User already registered" })
  @ApiForbiddenResponse({ description: "You must register admin first" })
  @HttpCode( HttpStatus.NO_CONTENT )
  @Post("register")
  async registerUser( @Body() username: Username ) {
    await this.appService.register(username.username);
  }

  @ApiOperation({ summary: "Create a car into ledger" })
  @ApiCreatedResponse({ description: "Car was created", type: CreateCar })
  @ApiUnauthorizedResponse({ description: "Please register user first" })
  @Post("createCar/:username")
  async createCar( @Param("username") username: string, @Body() body: CreateCar ): Promise<CreateCar> {
    return await this.appService.createCar( username, body );
  }

  @ApiOperation({ summary: "Transfer car ownership" })
  @ApiNoContentResponse({ description: "Transfer ownership success" })
  @ApiUnauthorizedResponse({ description: "Please register user first" })
  @Put( "transfer/:username" )
  async transferCar( @Param("username") username: string, @Body() body: CarTransfer ) : Promise<void> {
    await this.appService.transfer( username, body );
  }

  @ApiOperation({ summary: "Find One Car" })
  @ApiOkResponse({ description: "A Car" })
  @ApiUnauthorizedResponse({ description: "Unauthorized access, please register your username" })
  @Get(":username/car/:number")
  async findOne( @Param("username") username: string, @Param("number") carNumber: string ) {
    return await this.appService.findOne( username, carNumber );
  }

  @ApiOperation({ summary: "Find Car List" })
  @ApiOkResponse({ description: "Car List" })
  @ApiUnauthorizedResponse({ description: "Unauthorized access, please register your username" })
  @Get(":username")
  async find( @Param("username") username : string ) {
    return await this.appService.find(username);
  }
}
