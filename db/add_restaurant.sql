INSERT INTO restaurants
(image_url, name, rating, categories, price, city)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, image_url, name, rating, categories, price, city;
