import { TypeOrmModuleOptions } from '@nestjs/typeorm';

var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');

var myEnv = dotenv.config();
const myvalue = dotenvExpand.expand(myEnv).parsed;

const databaseUsername =myvalue.DB_USER_NAME || "";
const databasePassword =myvalue.DB_PASSWORD || "";
const databaseName =myvalue.DB_NAME || "";
const databaseHost =myvalue.DB_HOST || "";
const databasePort = myvalue.DB_PORT || "";
const databaseType=myvalue.DB_TYPE || "";


export const typeOrmConfig: TypeOrmModuleOptions = {
  type: databaseType,
  host: databaseHost,
  port: databasePort,
  username: databaseUsername,
  password: databasePassword,
  database: databaseName,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,

};

