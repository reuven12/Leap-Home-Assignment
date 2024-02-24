import { DataSourceOptions } from "typeorm";

const config: { server: any; db: DataSourceOptions } = {
  server: {
    port: process.env.PORT || 3000,
  },
  db: {
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT as string, 10) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "homework",
    // entities: [],
    synchronize: true,
  },
};

export default config;
