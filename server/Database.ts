import mongoose from 'mongoose';

import Locals from './Locals';

export class Database {

  public static init(): void {
    const host = Locals.config().mongo_host;
    const port = Locals.config().mongo_port;
    const db = Locals.config().mongo_db;


    const url = `mongodb://${host}:${port}/${db}`;

    const options = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    };

    mongoose.connect(url, options, (error) => {
      if(error) {
        throw error;
      }
      else {
        console.log('\x1b[33m%s\x1b[0m', 'Connected to Mongo Server');
      }
    });
  }
}

export default mongoose;