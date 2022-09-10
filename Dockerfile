FROM node:18-alpine 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
ENV DATABASE_URL=postgres://wdnpqtloooqelx:8a64abf549a602ea31428aa73577a1d790e0fc86fea65bdd9e22bb3275210b55@ec2-54-87-179-4.compute-1.amazonaws.com:5432/dcajikbuhd7m6i
ENV JWT_EXPIRE=1800
ENV JWT_SECRET=top_secret_value
EXPOSE $PORT

CMD ["node", "./bin/www"]

