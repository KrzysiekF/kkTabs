kkTabs jQuery Plugin
======

jQuery plugin for tabs

##How to install kkTabs Plugin?

1 In a page header following files should be included:

* jQuery library - you can download [HERE][jquery]

```html
<script type="text/javascript" src="jquery.js"></script>
```

* kkTabs plugin

```html
<script type="text/javascript" src="kktabs/js/kkTabs.min.js"></script>
```

* kkTabs plugin general styles

```html
<link href="kktabs/css/kktabs.default.css" rel="stylesheet" type="text/css">
```

2 HTML structure:

```html
<div class="tabs">
    <div class="tab">
        <h2>Tab title 1</h2>
        <p>Tab text 1</p>
    </div>
    <div class="tab">
        <h2>Tab title 2</h2>
        <p>Tab text 2</p>
    </div>
</div>
```

3 Plugin initialization:

```js
    $(document).ready(function(){
        $('.tabs').kkTabs();
    });
```

## COMING SOON

[jquery]: http://jquery.com
