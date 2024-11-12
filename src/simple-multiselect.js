class SimpleMultiselect extends HTMLElement {
  css = `<style>
    .multiselect {
      padding: 5px;
      cursor: pointer;
    }
    input[type="search"] {
      width: 100%;
      padding: .5rem;
      border: 1px solid lightgray;
    }
    .selected {
      display: none;
      min-height: 2rem;
      border: 1px solid lightgray;
      align-items: center;
      justify-content: start;
      padding: .1em .5em;
      gap: .7rem;
      flex-wrap: wrap;
    }
    .selected-option {
      background-color: gray;
      color: white;
      padding: 0 1rem;
      border-radius: 3px;
    }
    .options {
      display: none;
      border: 1px solid #ccc;
      padding: 10px;
      max-height: 150px;
      overflow-y: auto;
    }
    ::slotted(option) {
      padding: 5px;
      cursor: pointer;
      margin: .5rem 0;
    }
    ::slotted(option:hover) {
      background-color: #eee;
    }
    .multiselect.open .options {
      display: block;
    }
  </style>`.trim();

  static formAssociated = true;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this._value = [];
    this._selectedOptions = new Map();
    this._internals = this.attachInternals();
    this._hadUserInteraction = false;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.html = `
    <div class="multiselect">
      <div class="selected"></div>
      <input type="search" id="_multi-search" placeholder="${
        this.getAttribute('placeholder') || 'Seleccione'
      }">
      <div class="options">
        <slot></slot>
      </div>
    </div>`.trim();

    this.shadow.innerHTML = `${this.css}${this.html}`;

    this.container = this.shadow.querySelector('.multiselect');
    this.options = this.shadow.querySelector('.options');
    this.selected = this.shadow.querySelector('.selected');
    this.input = this.shadow.getElementById('_multi-search');
    this._slot = this.shadow.querySelector('slot');

    this.input.addEventListener('input', this.searchOptions.bind(this));
    this.selected.addEventListener('click', this.handleOptionSelected.bind(this));
    this.options.addEventListener('click', this.handleOptionSelected.bind(this));
    document.addEventListener('click', this.handleClick.bind(this, this.container));
    this.setSelectedOnLoad();
  }

  handleClick(multiselectContainer, event) {
    const bounds = multiselectContainer.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      multiselectContainer.classList.remove('open');
      if (this._selectedOptions.size > 0) {
        this.selected.style.display = 'flex';
        this.input.type = 'hidden';
      }
    } else {
      multiselectContainer.classList.add('open');
      this.input.type = 'search';
      this.input.focus();
    }
  }

  handleOptionSelected(e) {
    if (e.target.matches('span')) {
      this.restoreOption(e.target);
    }

    if (e.target.matches('option')) {
      this.setSelected(e.target);
    }
  }

  /** @param {HTMLOptionElement} option */
  setSelected(option) {
    const value = option.value;
    const text = option.textContent;
    this._selectedOptions.set(value, {
      text,
      value,
    });
    option.remove();
    option = null;
    this.renderSelectedOptions();
  }

  /** @param {HTMLSpanElement} option */
  restoreOption(option) {
    const value = option.dataset.value;
    const text = option.dataset.text;
    this.appendChild(new Option(text, value));
    this._selectedOptions.delete(value);
    option.remove();
    option = null;
    this.renderSelectedOptions();
  }

  searchOptions(e) {
    const value = e.target.value;
    if (!value) {
      this._slot
        .assignedElements({ flatten: true })
        .forEach((ele) => (ele.style.display = 'block'));
      return;
    }

    this._slot.assignedElements({ flatten: true }).forEach((ele) => {
      if (!ele.textContent.toLowerCase().includes(value.toLowerCase())) {
        ele.style.display = 'none';
      } else {
        ele.style.display = 'block';
      }
    });
  }

  renderSelectedOptions() {
    const fragment = new DocumentFragment();
    this._value = [];
    this._selectedOptions.forEach((info) => {
      const span = document.createElement('span');
      span.dataset.value = info.value;
      span.dataset.text = info.text;
      span.className = 'selected-option';
      span.textContent = info.text;
      fragment.append(span);
      this._value.push(info.value);
    });
    this._internals.setFormValue(this._value);
    this.selected.innerHTML = '';
    this.selected.append(fragment);
    if (this._selectedOptions.size > 0) {
      this.selected.style.display = 'flex';
      if (!this._hadUserInteraction) {
        this.input.type = 'hidden'
      }
    } else {
      this.selected.style.display = 'none';
      this.input.type = 'search';
    }
  }

  setSelectedOnLoad() {
    this._slot.assignedElements({ flatten: true }).forEach((ele) => {
      if (ele.selected) {
        this.setSelected(ele);
      }
    });
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClick.bind(this, this.container));
  }

  get value() {
    return this._value;
  }

  set value(v) {
    this._value = v;
  }

  get name() {
    return this.getAttribute('name');
  }
}

window.customElements.define('multi-select', SimpleMultiselect);
