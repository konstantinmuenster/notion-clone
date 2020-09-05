# notion-clone Frontend

### Stack

I tried to keep the frontend stack as lean as possible to don't add up external dependencies.
These are the most important pieces:

- Next.js
- React-Contenteditable
- Context API
- CSS Modules with SASS

### Components

#### editablePage

An editable page consists of several editable blocks. Each block has an unique ID and a position attribute. With the ID, the content of the block is being fetched from the backend. With the position attribute, the order of all blocks on the page is being determined. A block can only be placed once on a page.

```json
[
  {
    "blockId": 1,
    "position": 1
  }
]
```

#### editableBlock

An editable block is a div container that contains html. The html content can be edited by the user in-page

```json
{
  "html": "",
  "tag": "h1",
  "disabled": false,
  "placeholder": false,
  "tagSelectorMenuOpen": false
}
```
