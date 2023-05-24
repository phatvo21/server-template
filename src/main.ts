import {bootstrap} from 'nest-server-engine';
import {AppModule} from "./app/app.module";

bootstrap(AppModule, { title: 'User Service API', server: '/ws-user-service' });
