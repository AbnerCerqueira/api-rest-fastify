create database fastify;

use fastify;

create table user(
    id int auto_increment primary key,
    username varchar(100),
    password varchar(100)
);

select * from user;

truncate table user;