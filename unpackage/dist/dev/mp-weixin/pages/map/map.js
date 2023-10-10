"use strict";
const common_vendor = require("../../common/vendor.js");
const CustomNavBack = () => "../../compnnents/customNavBack/customNavBack.js";
let mapContext = null;
const _sfc_main = {
  name: "MapIndex",
  components: { CustomNavBack },
  data() {
    return {
      eventChannel: null,
      longitude: 104.065681,
      // 经度
      latitude: 30.653442,
      // 纬度
      height: 500,
      covers: [],
      name: "",
      address: "",
      detail: {}
      // 详情
    };
  },
  onLoad: function() {
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;
    eventChannel.on("postMap", ({ detail }) => {
      console.log("监听上一级数据", detail);
      this.name = detail.name;
      this.address = detail.addr;
      this.detail = detail;
      this.longitude = Number(detail.longitude);
      this.latitude = Number(detail.latitude);
      this.covers = [
        {
          id: detail.id,
          latitude: Number(detail.latitude),
          longitude: Number(detail.longitude),
          iconPath: "../../static/location.png",
          width: 15,
          height: 15,
          callout: { content: detail.name, display: "ALWAYS", padding: 6, borderRadius: 4, bgColor: "#fdc307" }
        }
      ];
    });
    this.height = common_vendor.index.getSystemInfoSync().waindowHeight + "px";
  },
  onUnload() {
    this.eventChannel.off("postLocation");
  },
  methods: {
    handleMapOpen() {
      try {
        if (mapContext === null) {
          mapContext = common_vendor.wx$1.createMapContext("map", this);
        }
        mapContext.openMapApp({
          longitude: Number(this.detail.longitude),
          latitude: Number(this.detail.latitude),
          destination: this.name,
          fail: (res) => {
            if (res.errMsg.indexOf("cancel") > -1) {
              common_vendor.index.showToast({
                icon: "fail",
                title: "取消导航"
              });
            } else {
              common_vendor.index.showToast({
                icon: "error",
                title: "经纬度错误"
              });
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
if (!Array) {
  const _component_CustomNavBack = common_vendor.resolveComponent("CustomNavBack");
  _component_CustomNavBack();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.height,
    b: $data.longitude,
    c: $data.latitude,
    d: $data.covers,
    e: common_vendor.t($data.name),
    f: common_vendor.t($data.address),
    g: common_vendor.o((...args) => $options.handleMapOpen && $options.handleMapOpen(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e06b858f"], ["__file", "/Users/heyuanpeng/个人项目/we-shop-app/pages/map/map.vue"]]);
wx.createPage(MiniProgramPage);
