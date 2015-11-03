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

If you use a cms or a backend heavy development environment, you can also set the plugin options via data attributes. Following table shows the name of the available data attributes for defining options.

```html
<a href="#modal-content" data-max-height="90%" data-fixed="true" data-on-close="refreshForm()">Open modal</a>
```

Data Attribute | Description
-------------- | ------------------------------------------------------------------------
class-name     | For advanced styling, allow to add your own style class to modal wrapper
href           | URL to load. If an external URL, uses Ajax Get to load the URL. If it is an inline content e.g. a hidden div, uses its html
width          | Width of the modal windows
height         | Height of the modal windows
max-width       | Max width of the modal windows. Add scrollbars when content is wider than the modal
max-height      | Max height of the modal windows. Add scrollbars when content is longer than the modal
append-to       | Where to append the modal content in the DOM
block-u-i        | Adds an overlay at the top of the page
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
on-remove	   | Calls the function when modal is removed

There are also available callbacks automatically fired when a certain event occurred. These callbacks can set with plugin options.

Callback			 | &nbsp;
-------------------- | -----
onReady              | Calls the function when plugin is ready
onOpen       	     | Calls the function when modal is opened
onStart     	     | Calls the function when modal start to get content to show
onLoad      	     | Calls the function when modal fetched and loaded to content
onClose		         | Calls the function when modal is closed
onRemove	         | Calls the function when modal is remove

### Event Hooks
Plugin uses both generic events and custom events. All events triggered in *uxrModal* namespace. Rather than firing a function/method via callback you can attach your own method to plugin events. Note that, custom events are triggered on the binded element e.g. the anchor opens the modal. 

```js
$('.modal').on('uxrclose.uxrModal', function(){
    form.submit(); // any method, function you want to define
});
```
 
Event Name			 | &nbsp;
-------------------- | -----
uxrready             | triggers when uxrModal binds to element for the first time
uxropen              | triggers when modal windows opens, the overlay and loading screen become visible
uxrstart             | triggers when modal content started to fetching, either from a inline source, html output or ajax call, or iframe
uxrload              | triggers when modal content fetched and inserted to the visible modal screen
uxrclose             | triggers when visible modal window closed either from clicking the overlay or close button
uxrresize            | triggers when modal contents resized, (resize actions actually working when you set maxHeight or maxWidth options and shows scrollbars when need)
uxrremove            | triggers when uxrModal unbinds from the element.

All these custom events except `uxrresize` also hooked the element itself when plugin is binded, and fires the callback options when triggered. `resize` method automatically called after content loaded to modal and `uxrresize` event triggered. 


### Public Methods
Method						| Description
--------------------------- | -------------------------------------------------------
$(selector).modal(options)  | Binds the plugin 
$.uxrmodal(options)         | Directly opens a modal with desired options
$.uxrmodal.resize           | Resizes the opened modals
$.uxrmodal.close            | Closes the opened modals
$.uxrmodal.version          | Shows the plugin version
$.uxrmodal.settings         | Shows the default settings
$.uxrmodal.getInstances()   | Shows the open modals and the lastOpened modal instance. You can get the last remaining instance's properties when all modals are closed.

```js
var activeInstances = $.uxrmodal.getInstances();

// you get an object with keys as instance IDs and lastInstance
```

Sample activeInstance

```js
// at least on modal is opened
{
    1: {
        $content: n.fn.init[1], // modal container template as a jQuery instance
        $el: n.fn.init[1], // jQuery instance of binded element
        _defaults: Object,
        _direct: false // opened via link
        _instance: 1 // the instance id,
        _name: 'uxrModal', // plugin name
        el: 'a.modal',
        href: 'somelink' // link to be open
        html: 'some html' // html string when html string added to direct call, or a jQuery instance of the fetched html from ajax or inline source
        inpage: false // indicates ajax call, iframe or an element in current page
        options: Object // plugin options
        previousInstance: Modal // modal instance opened before this modal. if only one modal present or multiple modal is not used, it is equal to the instance itself
        selector: '.modal' // jQuery selector used to bind plugin
    },
    lastInstance: Modal // if every modals are closed, it is the active instance. Instance 1 in this sample. In multiple modal activated and a modal is recently closed, it is the last closed modal.
}

// multiple mode active, first instance 7 opened then instance 5 opened
{
    5: {
        // ... other properties
        _instance: 5,
        previousInstance: Modal // is equal to instance 7
    },
    7: {
        // ... other properties
        _instance: 7,
        previousInstance: Modal // is equal to instance 7 since 7 is the first opened instance.
        
    }
    lastInstance: Modal // is equal to instance5
}

// every modal closed
{
    lastInstance: Modal // last closed modal's instance.
}
```
