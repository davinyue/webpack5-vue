FROM nginx:1.19.0-alpine AS auth-service-fe
MAINTAINER davinyu
WORKDIR /etc/apk
run echo 'http://mirrors.aliyun.com/alpine/v3.11/main' > repositories
run echo 'http://mirrors.aliyun.com/alpine/v3.11/community' >> repositories
#run apk update
#设置时区
#RUN apk add -U tzdata
#RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
COPY docker/zoneinfo/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' > /etc/timezone
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY dist /usr/share/nginx/html
WORKDIR /root
CMD nginx -g "daemon off;"