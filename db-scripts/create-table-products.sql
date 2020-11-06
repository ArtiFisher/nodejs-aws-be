CREATE TABLE products (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	title TEXT NOT NULL,
	image TEXT NOT NULL,
	description TEXT,
	price INT
);
