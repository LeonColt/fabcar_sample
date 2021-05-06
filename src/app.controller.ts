import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateCar, Username } from './app.model';
import { AppService } from './app.service';

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Register Admin" })
  @ApiNoContentResponse({ description: "Register admin success" })
  @ApiConflictResponse({ description: "Admin already registered" })
  @HttpCode( HttpStatus.CREATED )
  @Post("register/admin")
  async registerAdmin() {
    await this.appService.registerAdmin();
  }

  @ApiOperation({ summary: "Register User" })
  @ApiNoContentResponse({ description: "Register user success" })
  @ApiConflictResponse({ description: "User already registered" })
  @ApiForbiddenResponse({ description: "You must register admin first" })
  @HttpCode( HttpStatus.CREATED )
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

  @ApiOperation({ summary: "Query ledger" })
  @ApiOkResponse({ description: "Query Result" })
  @ApiUnauthorizedResponse({ description: "Unauthorized access, please register your username" })
  @Get(":username")
  async query( @Param("username") username : string ) {
    return await this.appService.query(username);
  }

}
