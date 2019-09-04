# Empathy frontend

FROM node:10.16.3 as frontend

# Set the Node environment, default is Development.

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --no-optional && npm cache clean --force

COPY . .

CMD ["npm", "start"]
