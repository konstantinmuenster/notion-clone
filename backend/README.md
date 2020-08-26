# notion-clone backend

### Stack
Backend: Node.js, Express.js, MongoDB, Mongoose, JWT

### Endpoints
- blocks (GET, POST, PUT, DELETE)
- users (GET, POST, PUT, DELETE)
- pages (GET, POST, PUT, DELETE)

### /blocks
- id
- type: h1, h2, h3, p, divider, image
- content: html or imageUrl
- user: refId 

### /users
- id
- username
- email
- password
- pages: list of pageIds

### /pages
- id
- page name
- pagePath
- userId
- blocks: ordered list of blocks