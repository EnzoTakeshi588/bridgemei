# Etapa 1: compilar o frontend
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_LOGIN_URL=http://localhost:5009
ARG VITE_ESTOQUE_URL=http://localhost:5017

ENV VITE_LOGIN_URL=$VITE_LOGIN_URL
ENV VITE_ESTOQUE_URL=$VITE_ESTOQUE_URL

RUN npm run build

# Etapa 2: servir os arquivos com Nginx
FROM nginx:alpine AS final

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
