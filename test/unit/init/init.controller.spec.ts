import { Test, TestingModule } from '@nestjs/testing';
import { InitController } from "../../../src/init/init.controller";
import { InitService } from "../../../src/init/init.service";

describe('Init Controller', () => {
  let appController: InitController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InitController],
      providers: [InitService],
    }).compile();

    appController = app.get<InitController>(InitController);
  });

  describe('Hello World', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
