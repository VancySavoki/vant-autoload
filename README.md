## vant-autoload
[中文](README-ZH-CN.md)

general autoload biz components based on [@youzan/vant](https://github.com/youzan/vant)

### Install
``` javascript
import Autoload from 'vant-autoload';

Vue.component(Autoload.name, Autoload);
```



### Usage

#### Basic Usage

```html
<autoload 
    :to="true"
    :clickable="true"
    :view="objView"
    :finished="finished"
    :loading="loading"
    :limit="10"
    :value="value"
    :canSwipe="true"
    :swipeRightView="swipeRightView"
    v-on:load="load"
    v-on:swipe-click="load" />
```

```js
class ViewModel {
    constructor(obj) {
        this.to = ''; // generate where you want jump
    }
}
const objView = {
    props: {
      value: ViewModel
    },
    render: h => h('span', 'Single Card Content' + this.value)
};
const swipeRightView = {
    props: {
      value: ViewModel,
      index: {
        type: Number
      }
    },
    render: h => h('span', 'Delete' + this.value)
};
export default {
  data() {
    return {
      value: [],
      objView: objView,
      swipeRightView: swipeRightView,
      loading: false,
      finished: false
    };
  },
  methods: {
    load() {
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.value.push(new ViewModel(this.value.length + 1));
        }
        this.loading = false;

        if (this.value.length >= 40) {
          this.finished = true;
        }
      }, 500);
    }
  }
};

```

#### Further Usage

```html
<autoload 
    :to="true"
    :clickable="true"
    :view="objView"
    :finished="finished"
    :loading="loading"
    :limit="10"
    :value="value"
    :canSwipe="true"
    v-on:load="load">
    <right-view 
        slot="right" 
        slot-scope="content" 
        v-bind="content" v-on:swipe-click="load">
</autoload>
```

```js
const objView = {
    props: {
      value: Object
    },
    render: h => h('span', 'Single Card Content' + this.value)
};
const rightView = {
    props: {
      value: Object,
      index: {
        type: Number
      }
    },
    render: h => h('button', {
        on: {
            click() {
                this.$emit('swipe-click');
            }
        }
    }, 'Delete' + this.value)
};
export default {
  components: {
    rightView: rightView,
  },
  data() {
    return {
      value: [],
      objView: objView,
      loading: false,
      finished: false
    };
  },
  methods: {
    load() {
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.value.push(new ViewModel(this.value.length + 1));
        }
        this.loading = false;

        if (this.value.length >= 40) {
          this.finished = true;
        }
      }, 500);
    }
  }
};

```
### API

| Attribute | Description | Type | Default | Required |
|-----------|-----------|-----------|-------------|------|
| to | Whether the `van-cell` $router.push() when clicking  | `Boolean` | `false` | `true` |
| clickable | Whether the `van-cell` reacts when clicking | `Boolean` | `false` | `false` |
| view | The main cell view, will be wrapped by `van-cell` | `VueComponent` |  | `true` |
| canSwipe | Whether support swipe right view | `Boolean` | `false` | `false` |
| value | The objects to be rendered | `Array` | `[]` | `true` |
| swipeRightView | If `canSwipe`, will render the swipe right view base on van-cell-swipe | `VueComponent` |  |  `true` |
| finished | Whether avoid emit loadEvent | `Boolean` | `true` | `false` |
| loading | Current loading state, if `true`, show loading components | `Boolean` | `false` | `false` |
| limit | Reserved attr | `Number` | `5` | `false` |
### slot

| Attribute | Description | Type | Default | Required |
|-----------|-----------|-----------|-------------|------|
| right | When swiping, the swiped item and index will be as the prop pass to the components | `VueComponent` |  | `false` |
### Origin Event

| Event | Description | Arguments |
|-----------|-----------|-----------|
| load | Triggered when the distance between the scrollbar and the bottom is less than offset | - |

### Transmit RightView Event

| Event | Description | Arguments |
|-----------|-----------|-----------|
| any | The event `$emit` by rightView will also export on this components, so just use `v-on` you can get the rightView events. For simplely, the listeners is not filtered currently | - |