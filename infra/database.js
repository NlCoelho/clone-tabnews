import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  console.log("Credenciais do Postgres: ", {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  try {
    console.log("Conectando ao banco de dados: " + process.env.POSTGRES_DB);
    await client.connect();
    console.log("Conexão realizada com sucesso!");
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    console.log("okara");
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};
