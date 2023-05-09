"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  _easycom_u_button2();
}
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  _easycom_u_button();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const longitude = common_vendor.ref(0);
    const latitude = common_vendor.ref(0);
    common_vendor.ref("11");
    common_vendor.onMounted(() => {
      common_vendor.index.getLocation({
        type: "wgs84",
        success: (res) => {
          longitude.value = res.longitude;
          latitude.value = res.latitude;
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "primary",
          text: "确定"
        }),
        b: longitude.value,
        c: latitude.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/学习/小程序/small-project/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
