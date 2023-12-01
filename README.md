# TS-crud

TS-crud foi criado para comprovar as minhas habilidades com [typescript](https://www.typescriptlang.org/), [docker](https://www.docker.com/) e mais algumas dependências contidas no projeto.

## Instalação/Configuração App
Crie uma copia do arquivo .env.example e nomeie-o como .env e declare suas variaveis de ambiente por exemplo:
```.env
JWT_SECRET=SEGREDOJWT

POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
```

Agora, vamos usar [yarn](https://yarnpkg.com/) para instalar todas as dependências do projeto TS com o seguinte comando:
```bash
$> yarn
yarn install v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
warning " > ts-node@10.9.1" has unmet peer dependency "@types/node@*".
[4/4] Building fresh packages...
Done in 15.17s.
```

Crie o volume externo para o container poder persistir as informações de maneira segura:
```bash
$> docker volume create mycrud-data

mycrud-data
```

Agora inicialize o container com os dois arquivos de configuração .yml:
```bash
$> docker-compose -f docker-compose.override.yml -f docker-compose.yml up -d

Creating mycrud_db  ... done
Creating mycrud_app ... done
```

O primeiro arquivo de configuração docker-compose.override.yml serve para criar a nossa base de dados postgresql :
```yml
version: "3"

services:
  db:
    container_name: mycrud_db
    image: postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
      PGDATA: /data/postgres
    volumes:
      - mycrud-data:/data/postgres
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  mycrud-data:
    external: true
```

O segundo arquivo de configuração docker-compose.yml serve para criar o nosso app express:
```yml
version: "3"

services:
  mycrud:
    container_name: mycrud_app
    build: .
    command: yarn dev
    ports:
      - "3001:3001"
    volumes:
      - .:/usr/app
    environment:
      - NODE_ENV=development
```

O próximo passo é rodar migrations dentro do nosso app express:

```bash
$> docker exec -it mycrud_app yarn typeorm migration:run -d ./src/database/connection.ts 

yarn run v1.22.19
$ typeorm-ts-node-commonjs migration:run -d ./src/database/connection.ts
query: SELECT * FROM current_schema()
query: SELECT version();
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = 'public' AND "table_name" = 'migrations'
query: SELECT * FROM "migrations" "migrations" ORDER BY "id" DESC
0 migrations are already loaded in the database.
1 migrations were found in the source code.
1 migrations are new migrations must be executed.
query: START TRANSACTION
query: CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying NOT NULL, "validEmail" boolean NOT NULL DEFAULT false, "phone" character varying NOT NULL, "password" character varying NOT NULL, "accountCode" integer, "attemptsAccountCode" integer NOT NULL DEFAULT '0', "deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), UNIQUE ("email"), PRIMARY KEY ("id"))
query: INSERT INTO "migrations"("timestamp", "name") VALUES ($1, $2) -- PARAMETERS: [1670568410873,"baseMigrations1670568410873"]
Migration baseMigrations1670568410873 has been  executed successfully.
query: COMMIT
Done in 5.78s.
```

Agora confira o status da api, se estiver tudo certo, o resultado será semelhante a esse:
```bash
$> curl --request GET \
  --url http://localhost:3001/api/v1/status

{"status":"available"}
```

Use o arquivo INSOMNIAGUIDE no [insomnia](https://insomnia.rest/) para facilitar a visualização de schemas e o teste das rotas