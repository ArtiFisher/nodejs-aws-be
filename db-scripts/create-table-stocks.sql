CREATE TABLE stocks (
	product_id uuid,
	count INT
	foreign key (product_id) references products(id)
);