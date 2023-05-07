"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const longitude = common_vendor.ref(0);
    const latitude = common_vendor.ref(0);
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
        a: longitude.value,
        b: latitude.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/学习/小程序/small-project/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
