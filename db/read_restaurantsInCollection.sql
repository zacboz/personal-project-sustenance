select collections.Name as Title, collections.Description, restaurants.id, restaurantCollection.restaurantId, image_url, restaurants.name, rating, categories, price
from restaurants
  join restaurantCollection on restaurants.Id = restaurantCollection.restaurantId
  join collections on restaurantCollection.collectionId = collections.Id
where collections.Id = $1;
