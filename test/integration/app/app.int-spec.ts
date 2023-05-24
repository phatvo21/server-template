import { ServerType, RequestType, generateMockServer, generateRequest} from "nest-server-engine";
import { AppModule } from "@app/user/app/app.module";

describe('AppController (e2e)', () => {
  let server: ServerType;
  let request: RequestType;

  beforeAll(async () => {
    server = await generateMockServer([AppModule]);
    request = generateRequest(server);
  });

  afterAll(async () => {
    await server.app.close();
  });


  it('/ (GET)', () => {
    return request.agent
      .get('/hello-world')
      .expect(200)
      .expect('Hello World!');
  });
});
