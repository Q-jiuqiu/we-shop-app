"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "NoData",
  props: {
    tips: {
      type: String,
      default: () => "暂无数据"
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.tips)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4613f9ef"], ["__file", "/Users/heyuanpeng/个人项目/小项目/we-shop-app/compnnents/noData/noData.vue"]]);
wx.createComponent(Component);
