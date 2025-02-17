## Para rodar o projeto localmente:

1. Executar o comando `docker compose up` para subir os containers do banco de dados e do minio.
2. Entre na pasta `backend` e execute o comando `npm run dev` para rodar o projeto.
 Para migrar o banco de dados, execute o comando `npx sequelize-cli db:migrate`
 Para deletar o banco de dados, execute o comando `npx sequelize-cli db:drop`
 Para criar o banco de dados, execute o comando `npx sequelize-cli db:create`
3. Entre na pasta `frontend` e execute o comando `npm run dev` para rodar o projeto.
# SaasBolt
# SaasBolt
