CREATE TABLE Users (
  userId SERIAL PRIMARY KEY,
  FacebookId VARCHAR(100),
  Name VARCHAR(30),
  Email VARCHAR(50),
  Location TEXT,
);

CREATE TABLE collections (
  Id SERIAL PRIMARY KEY,
  Name VARCHAR(30),
  Description TEXT,
  Imageurl TEXT,
  userId INT references Users(userId)
);


CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  image_url TEXT,
  name VARCHAR(30),
  rating VARCHAR(5),
  categories TEXT,
  price TEXT
);

CREATE TABLE restaurantCollection (
  Id SERIAL PRIMARY KEY,
  restaurantId INT references restaurants(id),
  collectionId INT references collections(Id)
);
