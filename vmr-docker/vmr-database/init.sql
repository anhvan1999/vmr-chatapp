drop database if exists vmrchat;
create database vmrchat character set utf8mb4 collate utf8mb4_unicode_ci;
use vmrchat;

create table users
(
    id        integer primary key auto_increment,
    username  varchar(20) not null unique,
    password  varchar(60) not null,
    name      varchar(45) not null,
    is_active boolean default true
);

create table messages
(
    id        bigint primary key auto_increment,
    sender    integer   not null,
    receiver  integer   not null,
    send_time timestamp not null,
    message   text      not null
);
