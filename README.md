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
// load a URL
$.uxrmodal({
    href: './modal-content.html'
});

// load and html content
var html = '<div class="my-content">' +
           '    <h2 class="my-content-title">Hello World</h2>' +
           '    <p>This is the modal content</p>' +
           '</div>';

$.uxrmodal({
    html: html
});
```

### Options
Property	  | Default | Description
------------- | ------- | ------------------------------------------------------------------------
className     | ''      | For advanced styling, allow to add your own style class to modal wrapper
href          | ''      | URL to load. If an external URL, uses Ajax Get to load the URL. If it is an inline content e.g. a hidden div, uses its html
width         | ''      | Width of the modal windows
height        | ''      | Height of the modal windows
maxWidth      | ''      | Max width of the modal windows. Add scrollbars when content is wider than the modal
maxHeight     | ''      | Max height of the modal windows. Add scrollbars when content is longer than the modal
appendTo      | body    | Where to append the modal content in the DOM. Overlay always appends to `body`
allowMultiple | false   | Allows to open more than one modal simultaneously
blockUI       | true    | Adds an overlay at the top of the page
overlayClose  | true    | Closes the modals when clicking on the overlay
close         | true    | Turns on/off the close icon in the modal
iframe        | false   | If true, the URL will load to an iFrame in the modal 
html          | false   | You can set an HTML content rather than a URL.
fixed         | false   | Uses fixed position for the modal 

Data Attribute | Description
-------------- | ------------------------------------------------------------------------
class-name     | For advanced styling, allow to add your own style class to modal wrapper
href           | URL to load. If an external URL, uses Ajax Get to load the URL. If it is an inline content e.g. a hidden div, uses its html
width          | Width of the modal windows
height         | Height of the modal windows
maxWidth       | Max width of the modal windows. Add scrollbars when content is wider than the modal
maxHeight      | Max height of the modal windows. Add scrollbars when content is longer than the modal
appendTo       | Where to append the modal content in the DOM
blockUI        | Adds an overlay at the top of the page
overlay-close  | Closes the modals when clicking on the overlay
allow-multiple | Allows to open more than one modal simultaneously
close          | Turns on/off the close icon in the modal
iframe         | If true, the URL will load to an iFrame in the modal 
html           | You can set an HTML content rather than a URL.
fixed          | Uses fixed position for the modal 
on-ready       | Calls the function when plugin is ready
on-open        | Calls the function when modal is opened
on-start       | Calls the function when modal start to get content to show
on-load        | Calls the function when modal fetched and loaded to content
on-close	   | Calls the function when modal is closed

Callback			 | &nbsp;
-------------------- | -----
onReady              | Calls the function when plugin is ready
onOpen       	     | Calls the function when modal is opened
onStart     	     | Calls the function when modal start to get content to show
onLoad      	     | Calls the function when modal fetched and loaded to content
onClose		         | Calls the function when modal is closed

### Public Methods
Method						| Description
--------------------------- | -------------------------------------------------------
$(selector).modal(options)  | Binds the plugin 
$.uxrmodal(options)         | Directly opens a modal with desired options
$.uxrmodal.resize           | Resizes the opened modals
$.uxrmodal.close            | Closes the opened modals
$.uxrmodal.version          | Shows the plugin version
$.uxrmodal.settings         | Shows the default settings
