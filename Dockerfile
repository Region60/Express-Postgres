FROM node:18-alpine 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
ENV JWT_SECRET=some_secret_value
ENV JWT_EXPIRE=1800
EXPOSE $PORT

CMD ["node", "./bin/www"]

