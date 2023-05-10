"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_scroll_list2 = common_vendor.resolveComponent("u-scroll-list");
  (_easycom_u_icon2 + _easycom_u_input2 + _easycom_u_scroll_list2)();
}
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_input = () => "../../uni_modules/uview-plus/components/u-input/u-input.js";
const _easycom_u_scroll_list = () => "../../uni_modules/uview-plus/components/u-scroll-list/u-scroll-list.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_input + _easycom_u_scroll_list)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const longitude = common_vendor.ref(0);
    const latitude = common_vendor.ref(0);
    const locateCity = common_vendor.ref("成都");
    const list = common_vendor.ref(
      [{
        name: "门店1",
        thumb: "https://cdn.uviewui.com/uview/goods/1.jpg"
      }, {
        name: "门店2",
        thumb: "https://cdn.uviewui.com/uview/goods/2.jpg"
      }, {
        name: "门店3",
        thumb: "https://cdn.uviewui.com/uview/goods/6.jpg"
      }, {
        name: "门店4",
        thumb: "https://cdn.uviewui.com/uview/goods/5.jpg"
      }, {
        name: "门店5",
        thumb: "https://cdn.uviewui.com/uview/goods/2.jpg"
      }]
    );
    common_vendor.onMounted(() => {
      common_vendor.index.getLocation({
        type: "wgs84",
        success: (res) => {
          console.log(res);
          longitude.value = res.longitude;
          latitude.value = res.latitude;
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    });
    const left = () => {
      console.log("left");
    };
    const right = () => {
      console.log("right");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "map-fill",
          color: "#f3950c",
          size: "19"
        }),
        b: common_vendor.t(locateCity.value),
        c: common_vendor.p({
          placeholder: "请输入内容",
          border: "surround",
          clearable: true,
          shape: "circle"
        }),
        d: longitude.value,
        e: latitude.value,
        f: common_vendor.f(list.value, (item, index, i0) => {
          return {
            a: item.thumb,
            b: common_vendor.t(item.name),
            c: index,
            d: common_vendor.n(index === 5 && "scroll-list__shops--no-margin-right")
          };
        }),
        g: common_vendor.o(right),
        h: common_vendor.o(left),
        i: common_vendor.p({
          indicatorWidth: 0
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/学习/小程序/small-project/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
