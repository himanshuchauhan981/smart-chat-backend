import mongoose from 'mongoose';

import Locals from './Locals';

export class Database {

  public static init(): void {
    const url = Locals.config().mongo_url;
    const db = Locals.config().mongo_db;
    const user = Locals.config().mongo_user;
    const password = Locals.config().mongo_password;

    // const mongoURL = `mongodb+srv://${user}:${password}@${url}?retryWrites=true&w=majority`
    const mongoURL = 'mongodb://127.0.0.1:27017/chat';

    const options = {
      dbName: db,
    };


    mongoose
      .connect(mongoURL, options)
      .then(() => {
        console.log('\x1b[33m%s\x1b[0m', 'Connected to Mongo Server');
      })
      .catch(error => {
        throw (error);
      });
  }
}

export default mongoose;