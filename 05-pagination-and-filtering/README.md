# 05-pagination-and-filtering

## Pagination & Filtering



Learn common list endpoint patterns.

Access via req.query:
1. ?author=tolkien
2. ?available=true
3. ?search=dune
4. ?sort=title
5. ?page=1&limit=10

* filter() for author, search, and available
* sort() for sort=title
* slice() for pagination

Conceptually:
* page=1 means “give me the first page of results.”
* limit=10 means “put at most 10 items on each page.”
/books?page=2&limit=10
would return books 11–20, and:
/books?page=5&limit=10 would return:

for search and stuff, just data and total

{
  "data": [
    /* books 41–42 */
  ],
  "page": 5,
  "limit": 10,
  "total": 42
}

## Resources
- https://expressjs.com/en/api.html#req.query
- https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
- https://www.merge.dev/blog/rest-api-pagination