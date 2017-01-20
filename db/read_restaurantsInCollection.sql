select collections.Name as Title, collections.Description, collections.Imageurl, restaurants.id, restaurantCollection.restaurantId, image_url, restaurants.name, rating, categories, city, price
from restaurants
  join restaurantCollection on restaurants.Id = restaurantCollection.restaurantId
  join collections on restaurantCollection.collectionId = collections.Id
where collections.Id = $1;
