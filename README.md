# simple-multiselect

### features

simple, lightweight and works inside forms

> usage

include the script

```html
<script defer src="./src/simple-multiselect.js"></script>
```

and then simply use the tag

```html
<multi-select></multi-select>
```

with options:

```html
<multi-select id="cities">
  <option value="madrid">Madrid</option>
  <option value="barcelona">Barcelona</option>
</multi-select>
```

getting the selected values

```js
const multiselect = document.getElementById('cities');
console.log(multiselect.value); // ['madrid', 'barcelona']
```

you can also attach a change event to it

```js
multiselect.addEventListener('change', (e) => {
  // do something on change
});
```

### supported attributes:

`placeholder` - the legend shown when there are no selected options

`value` - selected values

`name` - form name

**TODO:**

- keyboard support
- validate only children options as valid
- work with ajax
- refactor messy code
