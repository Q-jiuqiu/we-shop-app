"use strict";
const common_vendor = require("../../common/vendor.js");
const QQMapWX = require("../../static/qqmap-wx-jssdk.min.js");
let mapContext = null;
const location = {
  longitude: 104.065681,
  latitude: 30.653442,
  province: "",
  // 省份
  city: "",
  // 城市
  district: "",
  // 地区
  street: "",
  // 街道
  address: ""
  // 地址
};
let allData = [];
const _sfc_main = {
  name: "IndexPage",
  data() {
    return {
      longitude: 0,
      // 当前经度
      latitude: 0,
      // 当前纬度
      locateCity: "定位中…",
      // 当前城市名
      covers: [],
      // marker点信息
      swiperData: [],
      // 滑块数据
      isLocate: false,
      // 是否授权位置
      keyWord: ""
      // 搜索关键字
    };
  },
  onLoad: async function() {
    await this.getLocationInfo();
    this.longitude = location.longitude;
    this.latitude = location.latitude;
    this.locateCity = location.city || "未授权";
    common_vendor.index.setStorage({
      key: "location",
      data: location
    });
  },
  methods: {
    //获取位置信息
    getLocationInfo() {
      const this_ = this;
      return new Promise((resolve) => {
        common_vendor.index.getLocation({
          type: "gcj02",
          success(res) {
            console.log(res, "==");
            location.longitude = res.longitude;
            location.latitude = res.latitude;
            this_.isLocate = true;
            const qqmapsdk = new QQMapWX({ key: "NVCBZ-67BCV-7VAP3-56OOQ-P6OQS-A3BZ7" });
            qqmapsdk.reverseGeocoder({
              location,
              success(response) {
                let info = response.result;
                console.log(info);
                location.province = info.address_component.province;
                location.city = info.address_component.city;
                location.district = info.address_component.district;
                location.street = info.address_component.street;
                location.address = info.address;
                resolve(location);
              }
            });
          },
          fail(err) {
            this_.isLocate = false;
            console.log(err);
            resolve(location);
          }
        });
      });
    },
    // 获取筛选数据
    getData(params = {}) {
      console.log("筛选条件:", params);
      return new Promise((resolve) => {
        common_vendor.index.request({
          url: "http://8.137.19.141/pro/rest/dbs/find",
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
    setCovers(points) {
      console.log("marker点", points);
      this.covers = points.map((point, index) => {
        return {
          id: index,
          latitude: Number(point.latitude),
          longitude: Number(point.longitude),
          iconPath: "../../static/location.png",
          width: "15rpx",
          height: 10
        };
      });
    },
    // 数据排序-优先展示当前区域数据
    handleDataSort(regionData) {
      if (regionData.length === 0) {
        return allData;
      }
      const concatData = regionData.concat(allData);
      const res = /* @__PURE__ */ new Map();
      return concatData.filter((item) => !res.has(item.id) && res.set(item.id, 1));
    },
    // 输入改变
    async handleInputChange() {
    },
    // 打开地图导航app
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
    handleMoveTo(location2) {
      if (mapContext === null) {
        mapContext = common_vendor.wx$1.createMapContext("map", this);
        console.log(mapContext);
      }
      mapContext.moveToLocation({
        latitude: Number(location2.latitude),
        longitude: Number(location2.longitude)
      });
    },
    // 获取当前
    handleLocate() {
      if (this.isLocate) {
        this.handleMoveTo(location);
      } else {
        common_vendor.index.showModal({
          title: "您未开启地理位置授权",
          content: "为了您更好的体验， 请确认获取您的位置",
          confirmText: "确认",
          cancelText: "取消",
          success: ({ confirm }) => {
            if (confirm) {
              common_vendor.wx$1.openSetting({
                success: async ({ authSetting }) => {
                  const isLocation = authSetting && authSetting["scope.userLocation"];
                  if (isLocation) {
                    this.locateCity = "定位中…";
                    await this.getLocationInfo();
                    this.longitude = location.longitude;
                    this.latitude = location.latitude;
                    this.locateCity = location.city;
                    this.handleMoveTo();
                    const regionData = await this.getData({
                      region: location.district
                    });
                    this.setCovers(regionData);
                    this.swiperData = this.handleDataSort(
                      regionData
                    );
                  }
                },
                fail: () => {
                  common_vendor.index.showToast({
                    icon: "fail",
                    title: "弹出设置面板出错"
                  });
                }
              });
            }
          },
          fail: () => {
            console.log("展示modal框失败");
          }
        });
      }
    },
    getImageSrc(item) {
      return item.image || "https://cdn.udivui.com/udiv/goods/1.jpg";
    }
  }
};
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  (_easycom_u_icon2 + _easycom_u_input2)();
}
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
const _easycom_u_input = () => "../../uni_modules/uview-plus/components/u-input/u-input.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_input)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      name: "map-fill",
      color: "#f3950c",
      size: "19"
    }),
    b: common_vendor.t($data.locateCity),
    c: common_vendor.o((...args) => $options.handleLocate && $options.handleLocate(...args)),
    d: common_vendor.o(($event) => _ctx.$u.debounce($options.handleInputChange, 500)),
    e: common_vendor.o(($event) => $data.keyWord = $event),
    f: common_vendor.p({
      prefixIcon: "search",
      prefixIconStyle: "color: #909399",
      placeholder: "请输入店铺名称",
      border: "surround",
      clearable: true,
      shape: "circle",
      modelValue: $data.keyWord
    }),
    g: $data.longitude,
    h: $data.latitude,
    i: $data.covers
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/学习/小程序/small-project/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
