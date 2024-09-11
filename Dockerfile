FROM nginx

LABEL authors="gagaduck"

WORKDIR /app

COPY . .

RUN rm -rf /usr/share/nginx/html/*

COPY /build/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]