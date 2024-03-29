import dotenv from 'dotenv';

class Locals {

  public static config(): any {
    dotenv.config();

    const port = process.env.PORT;
    const host = process.env.HOST;

    // JWT Secret
    const jwt_secret = process.env.JWT_SECRET;

    // MONGO DB config
    const mongo_host = process.env.MONGO_HOSTNAME;
    const mongo_port = process.env.MONGO_PORT;
    const mongo_user = process.env.MONGO_USER;
    const mongo_password = process.env.MONGO_PASSWORD;
    const mongo_url = process.env.MONGO_URL;
    const mongo_db = process.env.MONGO_DB;

    return {
      port,
      host,
      jwt_secret,
      mongo_host,
      mongo_port,
      mongo_db,
      mongo_user,
      mongo_password,
      mongo_url
    };
  }
}

export default Locals;