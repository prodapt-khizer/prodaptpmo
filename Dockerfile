FROM node:18.19.1-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache python3 make g++ \
    && npm install -g npm@latest \
    && npm config set cache /root/.npm \
    && npm install --omit=dev \
    && npm run build \
    && apk del python3 make g++

CMD ["npm", "start"]