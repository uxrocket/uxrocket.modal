UX Rocket Modal
==============
A multi window capable modal plugin. It can easily customizable via its settings and styles.

Sample usage

```html
<a href="#hidden-content" class="modal">Open Modal</a>
```

```js
// with defaults
$('.modal').modal();

// or with your settings
$('.modal').modal({
    fixed: true,
    maxWidth: '640px',
    maxHeight: '90%'
});
```

Also it supports direct call from your script, during on page load or after an event

```js
// load and URL
$.uxrmodal({
    href: './modal-content.html'
});

// load and html content
var html = '<div class="my-content">' +
           '    <h2 class="my-content-title">Hello World</h2>' +
           '    <p>This is the modal content</p>';

$.uxrmodal({
    html: html
});
```