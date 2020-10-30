# notion-clone Frontend

### Stack

I tried to keep the frontend stack as lean and precise as possible. Hopefully, that makes it easier to understand...

The most important technologies / dependencies:

- Next.js
- Context API
- CSS Modules with SASS
- React-Contenteditable
- React-Beautiful-Dnd

### Main Components

#### editablePage

An editable page consists of several blocks. Each block has an unique ID as well as content data (html, tag, imageUrl). When a page gets requested, we fetch the blocks on the server and pass it (along with the page ID) to the editablePage component.

All pre-fetched blocks are being stored in state. When the user modifies a block, the page gets updated and sends the update to the server as well. If we have multiple blocks and the user changes their order, we just update the block index inside the array.

Shape of `blocks`:

```json
[
  {
    "_id": "5f54d75b114c6d176d7e9765",
    "html": "Heading",
    "tag": "h1",
    "imageUrl": ""
  }
]
```

#### editableBlock

An editable block is a contenteditable element. It receives the content and html tag (or the imageUrl) from the page it is placed on. The tag determines the html element type (e.g. `"h1"` turns into `<h1>`) and thus its styling.

The component essentially differentiates between text content and image content that gets passed into it. Receiving the `img` tag with an `imageUrl`, we render an image, receiving any other tag with `html`, we render a contenteditable container, respectively.

Any other state properties are being used to keep track of user inputs and the visibility of different type of menus.

```json
{
  "html": "",
  "tag": "p",
  "imageUrl": "",
  "placeholder": false,
  "previousKey": null,
  "isTyping": false,
  "tagSelectorMenuOpen": false,
  "tagSelectorMenuPosition": {
    "x": null,
    "y": null
  },
  "actionMenuOpen": false,
  "actionMenuPosition": {
    "x": null,
    "y": null
  }
}
```
