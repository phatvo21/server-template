import { Module } from '@nestjs/common';
import {BaseModule} from "nest-server-engine";
import {InitModule} from "./init/init.module";

@Module({
  imports: [BaseModule, InitModule],
})
export class AppModule {}
