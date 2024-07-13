FROM node:21-alpine

WORKDIR /valorao/api

COPY prisma /valorao/api/prisma
COPY src /valorao/api/src

COPY package.json /valorao/api/
COPY tsconfig.json /valorao/api/

RUN npm i
RUN npm install -g nodemon
RUN npx prisma generate

CMD ["npm", "start"]
