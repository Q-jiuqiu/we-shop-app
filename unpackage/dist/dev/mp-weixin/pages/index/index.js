"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../static/qqmap-wx-jssdk.min.js");
const CustomNavBack = () => "../../compnnents/customNavBack/customNavBack.js";
let mapContext = null;
const _sfc_main = {
  name: "IndexPage",
  components: { CustomNavBack },
  data() {
    return {
      longitude: common_vendor.index.getStorageSync("location").longitude,
      // 当前经度
      latitude: common_vendor.index.getStorageSync("location").latitude,
      // 当前纬度
      locateCity: "定位中…",
      // 当前城市名
      markers: [],
      // marker点信息
      foodsDatas: [],
      // 美食数据
      isLocate: false,
      // 是否授权位置
      keyWord: "",
      // 搜索关键字
      dataList: []
    };
  },
  onLoad: function() {
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;
    eventChannel.on("foodMap", ({ data }) => {
      console.log(data);
      this.dataList = data;
      this.setMarkers(data);
    });
  },
  methods: {
    // 获取美食筛选数据
    getFoodsDatas(params = {}) {
      console.log("筛选条件:", params);
      return new Promise((resolve) => {
        common_vendor.index.request({
          url: "https://www.aomue.cn/pro/rest/dbs/find",
          data: params,
          method: "GET",
          success: function(res) {
            const data = res.data.data;
            console.log("结果:", data);
            resolve(data);
          },
          fail: function(err) {
            console.log(err);
            resolve([]);
          }
        });
      });
    },
    // 设置markArray
    setMarkers(points) {
      this.markers = points.map((point, index) => {
        return {
          id: index,
          latitude: Number(point.latitude),
          longitude: Number(point.longitude),
          iconPath: "../../static/location.png",
          width: 25,
          height: 25,
          callout: { content: point.name, display: "ALWAYS", padding: 6, borderRadius: 4, bgColor: "#fdc307" }
        };
      });
      console.log(this.markers);
    },
    handleDetailShow(item) {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail",
        success: (res) => {
          console.log(res);
          res.eventChannel.emit("postMessage", {
            detail: item,
            longitude: location.longitude,
            latitude: location.latitude
          });
        }
      });
    },
    // 移动到指定坐标为止
    handleMoveTo(location2) {
      console.log("location", location2);
      if (mapContext === null) {
        mapContext = common_vendor.wx$1.createMapContext("map", this);
        console.log(mapContext);
      }
      mapContext.moveToLocation({
        latitude: Number(location2.latitude),
        longitude: Number(location2.longitude)
      });
    },
    // marker点击事件
    handleMarkerClick(event) {
      console.log(1111);
      console.log(event);
      const detail = event.detail;
      console.log(detail);
      if (detail && !isNaN(detail.markerId)) {
        const detailInfo = this.dataList[detail.markerId];
        common_vendor.index.navigateTo({
          url: "/pages/detail/detail",
          success: (res) => {
            res.eventChannel.emit("detailPage", { detail: detailInfo });
          }
        });
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
    a: $data.longitude,
    b: $data.latitude,
    c: $data.markers,
    d: common_vendor.o((...args) => $options.handleMarkerClick && $options.handleMarkerClick(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/学习/小程序/we-shop-app/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
