# simple-multiselect

### features
simple, lightweight and works with forms

> usage

include the script

```html
<script defer src="./src/simple-multiselect.js"></script>
```

and then simply use the tag
```html
<multi-select></multi-select>
```

## **you need to pass a list of options**
```html
<multi-select>
    <option value="madrid">Madrid</option>
    <option value="barcelona">Barcelona</option>
</multi-select>
```

it supports the following parameters:

*placeholder*

*id*

*name*

found a bug? create an issue! ill try to look into it

**TODO:**

- render selected options on fresh page reload
- validate only children options as valid
- add an icon to the end right of the container
- optional color styles
- work with ajax
- refactor messy code