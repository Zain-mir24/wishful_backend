import { TypeOrmModuleOptions } from '@nestjs/typeorm';
var parse = require('pg-connection-string').parse;
var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');

var myEnv = dotenv.config();
const myvalue = dotenvExpand.expand(myEnv).parsed;
const connectionOptions = parse(myvalue.POSTGRES_URL);

// const databaseUsername =myvalue.DB_USER_NAME;
// const databasePassword =myvalue.DB_PASSWORD;
// const databaseName =myvalue.DB_NAME;
// const databaseHost =myvalue.DB_HOST;
// const databasePort = myvalue.DB_PORT;
const databaseType=myvalue.DB_TYPE;

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: databaseType,
  host: connectionOptions.host,
  port: connectionOptions.port,
  username: connectionOptions.user,
  password: connectionOptions.password,
  database: connectionOptions.database,
  ssl: require,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,

};

