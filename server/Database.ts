import mongoose from 'mongoose';

import Locals from './Locals';

export class Database {

  public static init(): void {
    const url = Locals.config().mongo_url;
    const db = Locals.config().mongo_db;
    const user = Locals.config().mongo_user;
    const password = Locals.config().mongo_password;

    const mongoURL = `mongodb+srv://${user}:${password}@${url}?retryWrites=true&w=majority`

    const options = {
      dbName: db,
    };

    mongoose.connect(mongoURL, options, (error) => {
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