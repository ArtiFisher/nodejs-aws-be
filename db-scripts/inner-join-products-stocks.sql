SELECT id, title, image, description, price, count FROM products INNER JOIN stocks ON products.id = stocks.product_id;
