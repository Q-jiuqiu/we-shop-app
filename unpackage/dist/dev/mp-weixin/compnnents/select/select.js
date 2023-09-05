"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "selectPage",
  props: {
    options: {
      type: Array,
      default: () => []
    },
    selectName: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      selectIndex: 0,
      itemHeight: 0,
      height: 0,
      showMask: false
    };
  },
  created() {
    console.log(this.selectName);
    const query = common_vendor.index.createSelectorQuery().in(this);
    query.select(".select-item").boundingClientRect((rect) => {
      console.log("backTop:", rect);
      this.itemHeight = rect.height;
    }).exec();
  },
  // beforeDestroy() {
  // 	uni.$off('handleSelectShow', this.selecancelContainercName)
  // },
  methods: {
    handleSelectClick() {
      this.$emit("fixedTo", { height: "100vh", overflow: "hidden" });
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
      this.showMask = true;
      const length = this.options.length > 8 ? 8 : this.options.length;
      this.height = `${this.itemHeight * length}px`;
    },
    // cancelContainer(name) {
    cancelContainer() {
      this.$emit("fixedTo", {});
      this.showMask = false;
      this.height = "0px";
    },
    handleItemSelect(index) {
      this.selectIndex = index;
      this.$emit("select", index);
      this.cancelContainer();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.showMask,
    b: common_vendor.o((...args) => $options.cancelContainer && $options.cancelContainer(...args)),
    c: common_vendor.t($props.options[$data.selectIndex].name),
    d: common_vendor.o((...args) => $options.handleSelectClick && $options.handleSelectClick(...args)),
    e: common_vendor.f($props.options, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.n({
          active: index === $data.selectIndex
        }),
        c: index,
        d: common_vendor.o(($event) => $options.handleItemSelect(index), index)
      };
    }),
    f: $data.height
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-79700a36"], ["__file", "/Users/heyuanpeng/个人项目/we-shop-app/compnnents/select/select.vue"]]);
wx.createComponent(Component);
