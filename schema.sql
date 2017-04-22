create database Bamazon;

use Bamazon;

create table products (
item_id integer (30) not null auto_increment primary key,
product_name varchar (50),
department_name varchar (50),
price dec (10,2),
stock_quantity integer (20)
);


       
select * from products;
