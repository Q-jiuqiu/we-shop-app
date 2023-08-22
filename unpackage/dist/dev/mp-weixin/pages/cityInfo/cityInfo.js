"use strict";
const common_vendor = require("../../common/vendor.js");
const CustomNavBack = () => "../../compnnents/customNavBack/customNavBack.js";
const _sfc_main = {
  name: "cityInfo",
  components: { CustomNavBack },
  data() {
    return {
      imageList: [
        "https://t7.baidu.com/it/u=760837404,2640971403&fm=193&f=GIF"
      ],
      cityDes: ""
    };
  },
  onLoad: function() {
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;
    eventChannel.on("cityInfo", ({ cityInfo }) => {
      console.log(cityInfo);
      this.cityDes = cityInfo.cityDes;
      this.imageList = cityInfo.imageList;
    });
  }
};
if (!Array) {
  const _component_CustomNavBack = common_vendor.resolveComponent("CustomNavBack");
  const _easycom_u_swiper2 = common_vendor.resolveComponent("u-swiper");
  (_component_CustomNavBack + _easycom_u_swiper2)();
}
const _easycom_u_swiper = () => "../../uni_modules/uview-plus/components/u-swiper/u-swiper.js";
if (!Math) {
  _easycom_u_swiper();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      list: $data.imageList
    }),
    b: common_vendor.t($data.cityDes)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-be7b8072"], ["__file", "D:/学习/小程序/we-shop-app/pages/cityInfo/cityInfo.vue"]]);
wx.createPage(MiniProgramPage);