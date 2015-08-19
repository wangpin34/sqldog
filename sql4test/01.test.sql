CREATE DATABASE  IF NOT EXISTS testsqldog ;

use testsqldog;

create table student (
	id int primary key auto_increment,
	name varchar(20) not null
);
