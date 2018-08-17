import { Cell, CellSwipe, List } from 'vant';
import { ContentLoader } from 'vue-content-loader';
var Loader = {
  name: 'loader',
  functional: true,
  render: function render(h, _ref) {
    var data = _ref.data;
    return h(ContentLoader, data, [h('rect', {
      attrs: {
        x: '107',
        y: '0',
        rx: '4',
        ry: '4',
        width: '60%',
        height: '1em'
      }
    }), h('rect', {
      attrs: {
        x: '107',
        y: '31',
        rx: '3',
        ry: '3',
        width: '50%',
        height: '1em'
      }
    }), h('rect', {
      attrs: {
        x: '7.5',
        y: '0',
        rx: '0',
        ry: '0',
        width: '90',
        height: '120'
      }
    })]);
  }
};
const props = {
  to: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  value: {
    type: [Object, Array],
    required: true
  },
  view: {
    type: [Object, Function]
  },
  canSwipe: {
    type: Boolean,
    default: false
  },
  swipeRightView: {
    type: [Object, Array]
  }
};
const FunctionalFactory = VNode => ({
  name: VNode.tag,
  functional: true,
  render: h => VNode
});
const VNodeFactory = VNode => ({
  name: VNode.tag,
  render: h => VNode
});
const Delegate = {
  functional: true,
  props,
  render(h, context) {
    const ModelView = context.props.view;
    let cellProp;
    if (context.props.to) {
      cellProp = {
        props: {
          clickable: context.props.clickable,
          to: context.props.value.to
        }
      };
    } else {
      cellProp = {
        props: {
          clickable: context.props.clickable
        }
      };
    }
    const contentSlotIndex = 0;
    let cellContent;
    if (context.children && context.children.length > contentSlotIndex && context.children[contentSlotIndex].data.slot === 'content') {
      cellContent = [h(VNodeFactory(context.children[contentSlotIndex]), { props: context.props })];
    } else {
      cellContent = [h(ModelView, { props: context.props, on: context.data.on })];
    }
    const cell = h(Cell, cellProp, cellContent);
    if (context.props.canSwipe) {
      const RightView = context.props.swipeRightView;
      let right;
      const slotIndex = 1;
      if (context.children && context.children.length > slotIndex && context.children[slotIndex].data.slot === 'right') {
        right = h(VNodeFactory(context.children[slotIndex]), { slot: 'right' });
      } else {
        right = h(RightView, {
          props: {
            index: context.data.props.index,
            value: context.props.value
          },
          on: context.data.on,
          slot: 'right'
        });
      }
      const item = h(CellSwipe, {
        props: {
          rightWidth: 65
        }
      }, [cell, right]);
      return item;
    } else {
      return cell;
    }
  }
};
/**
 * @param {Boolean} to whether the single card could goto another page or not
 * @param {Boolean} clickable whether the single card reactive when clicking
 * @param {VueComponent} view the single card
 * @param {Boolean} finished whether finishing load all data
 * @param {Boolean} loading the current loading state
 * @param {Number} limit when loading, render the same amount of cards placeholder
 * @param {Array<any>} value the data arrays to be rendered
 * @param {Boolean} canSwipe support the right swipe
 * @param {VueComponent} swipeRightView the @canSwipe set to true, should supply this, or a slot name of right
 * @event load trigger event when scrolling to screen bottom
 * @event swipe-X dispatch any event from the right slot, NOT SECUIRTY, cause the $listeners is not filtered
 * @slot['right'] replace @swipeRightView, use slot-scope expose card value, a more simple usage
 * @returns {VueComponent} VueComponent
 * @example (<autoload :to='true' :clickable='true' :view='objView' :finished='false' :loading='false' :limit='10' :value='value' :canSwipe='true' v-on:load='load'><right-view slot='right' slot-scope='content' v-bind='content' v-on:swipe-click='load'></autoload>)
 * @example (<autoload :to='true' :clickable='true' :view='objView' :finished='false' :loading='false' :limit='10' :value='value' :canSwipe='true' :swipeRightView='swipeRightView' v-on:load='load' v-on:swipe-click='load' />)
 * @todo use mem cache, minimize the render time consuming
*/
export default {
  name: 'autoload',
  render(h) {
    const on = this.$listeners;
    /**
     * For safe, use this block code below,
     * if performance is more concerned, k-
     * eeping it now.
     */
    /* const on = Object
    .keys(this.$listeners)
    .filter(key => key.startsWith('swipe'))
    .reduce((pre, key) => {
      pre[key] = this.$listeners[key];
      return pre;
    }, {}); */
    const $props = this.$props;
    const slots = this.value.map((val, index) => {
      const content = [];
      if (this.$scopedSlots.content) {
        content.push(
          h(FunctionalFactory(this.$scopedSlots.content({ value: val })), { slot: 'content' })
        );
      }
      if (this.$scopedSlots.right) {
        content.push(
          h(FunctionalFactory(this.$scopedSlots.right({ value: val, index })), { slot: 'right' })
        );
      }
      return h(Delegate, {
        props: { ...$props, value: val, index },
        on
      }, content);
    });
    const vanlist = h(List,
      {
        props: {
          value: this.loading,
          finished: this.finished,
          immediateCheck: false,
          offset: 15
        },
        on: {
          load: obj => {
            if (!this.loading) {
              this.$emit('load', obj);
            }
          }
        }
      },
      slots
    );
    const template = Array.apply(null, { length: this.limit }).map(() => h(Loader));
    const child = this.loading ? [vanlist, ...template] : [vanlist];
    const root = h('div', child);
    return root;
  },
  props: {
    ...props,
    finished: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 5
    }
  }
};
