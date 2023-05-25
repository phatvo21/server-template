import { Controller, Get } from '@nestjs/common';
import { InitService } from './init.service';
import { BaseEntity, GetEndpoint } from 'nest-server-engine';
import { InitDto } from "./dtos/init.dto";

@Controller("hello-world")
export class InitController {
  constructor(private readonly appService: InitService) {}

  @Get()
  @GetEndpoint("Endpoint allow to fetch hello-world", InitDto, BaseEntity)
  getHello(): string {
    return this.appService.getHello();
  }
}
