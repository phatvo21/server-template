import {bootstrap} from 'nest-server-engine';
import {AppModule} from "./app.module";

bootstrap(AppModule, { title: 'API Documents', server: '/ws-~~name~~-api' });
