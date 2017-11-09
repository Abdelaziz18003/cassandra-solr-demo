This is a simple API that integrate cassandra database with solr search engine using node.js

It is a simple book store where the book schema is:

```bash
CREATE TABLE books (
  id uuid PRIMARY KEY,
  title text,
  description text
)
```

# usage

to test the demo you need to use a rest client (like postman or rested for firefox)

- `POST /insert`: insert a new book (new book's data is required to be sent with the request).
- `GET /get`: get all inserted books.
- `POST /update?id=book-id`: update a specific book. (book's data is required to be sent with the request)
- `GET /delete?id=book-id`: delete a specific book.
- `GET /search?q=field:value`: search for a book where the given field contains the given value.