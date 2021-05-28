import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CarTransfer, CreateCar, CreateCarFinance, CreateCarFinancePayment, Username } from './app.model';
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

  @ApiOperation({ summary: "Create a car into ledger" })
  @ApiCreatedResponse({ description: "Car was created", type: CreateCar })
  @ApiUnauthorizedResponse({ description: "Please register user first" })
  @Post("createFinance/:username")
  async createFinance( @Param("username") username: string, @Body() body: CreateCarFinance ) {
    return await this.appService.createCarFinance( username, body );
  }

  @ApiOperation({ summary: "Create a car into ledger" })
  @ApiCreatedResponse({ description: "Car was created", type: CreateCar })
  @ApiUnauthorizedResponse({ description: "Please register user first" })
  @Post("createPayment/:username")
  async createPayment( @Param("username") username: string, @Body() body: CreateCarFinancePayment ) {
    return await this.appService.createCarFinancePayment( username, body );
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
  async findOneCar( @Param("username") username: string, @Param("number") carNumber: string ) {
    return await this.appService.findOneCar( username, carNumber );
  }

  @ApiOperation({ summary: "Find Car List" })
  @ApiOkResponse({ description: "Car List" })
  @ApiUnauthorizedResponse({ description: "Unauthorized access, please register your username" })
  @Get(":username/car")
  async findCar( @Param("username") username : string ) {
    return await this.appService.findCar(username);
  }

  @ApiOperation({ summary: "Find One Finance" })
  @ApiOkResponse({ description: "A Finance" })
  @ApiUnauthorizedResponse({ description: "Unauthorized access, please register your username" })
  @Get(":username/finance/:financeId")
  async findOneFinance( @Param("username") username: string, @Param("financeId") financeId: string ) {
    return await this.appService.findOneCar( username, financeId );
  }

  @ApiOperation({ summary: "Find Finance List" })
  @ApiOkResponse({ description: "Finance List" })
  @ApiUnauthorizedResponse({ description: "Unauthorized access, please register your username" })
  @Get(":username/finance")
  async findFinance( @Param("username") username : string ) {
    return await this.appService.findFinance(username);
  }

  @ApiOperation({ summary: "Find One Payment" })
  @ApiOkResponse({ description: "A Payment" })
  @ApiUnauthorizedResponse({ description: "Unauthorized access, please register your username" })
  @Get(":username/payment/:paymentId")
  async findOnePayment( @Param("username") username: string, @Param("paymentId") paymentId: string ) {
    return await this.appService.findOnePayment( username, paymentId );
  }

  @ApiOperation({ summary: "Find Payment List" })
  @ApiOkResponse({ description: "Payment List" })
  @ApiUnauthorizedResponse({ description: "Unauthorized access, please register your username" })
  @Get(":username/payment")
  async findPayment( @Param("username") username : string ) {
    return await this.appService.findPayment(username);
  }
}
