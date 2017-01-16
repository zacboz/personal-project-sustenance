UPDATE collections
SET Name = $2,
    Description = $3,
    Imageurl = $4,
    userid = $5
WHERE Id = $1;
