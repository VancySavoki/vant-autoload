## vant-autoload
[英文](README.md)

基于[@youzan/vant](https://github.com/youzan/vant)的自动加载通用业务组件

### 安装
``` javascript
import Autoload from 'vant-autoload';

Vue.component(Autoload.name, Autoload);
```



### 用法

#### 基础用法

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
        this.to = ''; // 通过视图模型转换，将返回对象进行包装，生成任何你想要的属性。
        /**
         *  to 属性是必须的，如果要支持点击跳转。
         * */
    }
}
const objView = {
    props: {
      value: ViewModel
    },
    render: h => h('span', '单项数据' + this.value)
};
const swipeRightView = {
    props: {
      value: ViewModel,
      index: {
        type: Number
      }
    },
    render: h => h('span', '删除' + this.value)
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

#### 高级用法

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

| 属性 | 描述 | 类型 | 默认值 | 是否必须 |
|-----------|-----------|-----------|-------------|------|
| to | 当点击单个item时， `van-cell` 是否应该跳转  | `Boolean` | `false` | `true` |
| clickable | 当点击单个item时， `van-cell` 是否应该响应 | `Boolean` | `false` | `false` |
| view | 单个item的主视图，会被`van-cell`包装 | `VueComponent` |  | `true` |
| canSwipe | 是否支持单个项目的侧滑 | `Boolean` | `false` | `false` |
| value | 要被渲染的数据对象合集 | `Array` | `[]` | `true` |
| swipeRightView | 如果要支持侧滑，请传递这个组件属性，或通过`right` slot传入组件 | `VueComponent` |  |  `true` |
| finished | 数据是否已全部加载完毕 | `Boolean` | `true` | `false` |
| loading | 当前加载状态，如果为`true`,将会显示loading组件 | `Boolean` | `false` | `false` |
| limit | 保留属性，用作改善loading,例如渲染同等数量的loading组件 | `Number` | `5` | `false` |
### slot

| 名称 | 描述 | 类型 | 默认值 | 是否必须 |
|-----------|-----------|-----------|-------------|------|
| right | 侧滑时，渲染的组件，内部会将被侧滑的item和index作为属性传递给该组件 | `VueComponent` |  | `false` |
### 组件原生事件

| 事件 | 描述 | 参数 |
|-----------|-----------|-----------|
| load | 当滚动到触底，触发load | - |

### 传递侧滑组件的所有事件到顶层

| Event | Description | Arguments |
|-----------|-----------|-----------|
| any | 将本组件所有的监听器传递到传入的侧滑组件上 | - |