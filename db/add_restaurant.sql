INSERT INTO restaurants
(image_url, name, rating, categories, price)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, image_url, name, rating, categories, price;
