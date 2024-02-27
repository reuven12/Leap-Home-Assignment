import { Server } from './server';
import { initDatabase } from './db/dataSource';

(async () => {
  try {
    await initDatabase();
    const server: Server = Server.bootstrap();
    server.listen();
  } catch (error) {
    console.log('ERROR while trying to start Server');
  }
})();
