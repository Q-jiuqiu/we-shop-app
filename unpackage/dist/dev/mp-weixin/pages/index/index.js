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
  setup() {
    const longitude = common_vendor.ref(0);
    const latitude = common_vendor.ref(0);
    const locateCity = common_vendor.ref("定位中…");
    const covers = common_vendor.ref([]);
    const swiperData = common_vendor.ref([]);
    const isLocate = common_vendor.ref(false);
    const keyWord = common_vendor.ref("");
    return {
      longitude,
      latitude,
      locateCity,
      covers,
      swiperData,
      isLocate,
      keyWord
    };
  },
  onLoad: async function() {
    await this.getLocationInfo();
    this.longitude = location.longitude;
    this.latitude = location.latitude;
    this.locateCity = location.city || "未授权";
    allData = await this.getData();
    if (location.district) {
      const regionData = await this.getData({ region: location.district });
      this.setCovers(regionData);
      this.swiperData = this.handleDataSort(regionData);
    } else {
      this.swiperData = allData;
    }
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
      return new Promise((resolve) => {
        common_vendor.index.request({
          url: "http://8.137.19.141/pro/rest/dbs/find",
          data: params,
          method: "GET",
          success: function(res) {
            const data = res.data.data;
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
      this.covers = points.map((point, index) => {
        return {
          id: index,
          latitude: Number(point.latitude),
          longitude: Number(point.longitude),
          iconPath: "../../static/location.png",
          width: 10,
          height: 10
        };
      });
    },
    // 数据排序-优先展示当前区域数据
    handleDataSort(regionData) {
      if (regionData.length === 0) {
        return allData;
      }
      const concatData = allData.concat(regionData);
      const res = /* @__PURE__ */ new Map();
      return concatData.filter((item) => !res.has(item.id) && res.set(item.id, 1));
    },
    // 输入改变
    async handleInputChange() {
      const regionData = await this.getData({ name: this.keyWord });
      this.setCovers(regionData);
      this.swiperData = regionData;
    },
    // 打开地图导航app
    openMapApp(item) {
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
    handleMoveTo() {
      if (mapContext === null) {
        mapContext = common_vendor.wx$1.createMapContext("map", this);
        console.log(mapContext);
      }
      mapContext.moveToLocation({
        latitude: Number(location.latitude),
        longitude: Number(location.longitude)
      });
    },
    // 获取当前
    handleLocate() {
      if (this.isLocate) {
        this.handleMoveTo();
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
      return item.image || "https://cdn.uviewui.com/uview/goods/1.jpg";
    }
  }
};
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      name: "map-fill",
      color: "#f3950c",
      size: "19"
    }),
    b: common_vendor.t($setup.locateCity),
    c: common_vendor.o((...args) => $options.handleLocate && $options.handleLocate(...args)),
    d: common_vendor.o(($event) => _ctx.$u.debounce($options.handleInputChange, 500)),
    e: common_vendor.o(($event) => $setup.keyWord = $event),
    f: common_vendor.p({
      prefixIcon: "search",
      prefixIconStyle: "color: #909399",
      placeholder: "请输入内容",
      border: "surround",
      clearable: true,
      shape: "circle",
      modelValue: $setup.keyWord
    }),
    g: $setup.longitude,
    h: $setup.latitude,
    i: $setup.covers,
    j: common_vendor.f($setup.swiperData, (item, index, i0) => {
      return {
        a: $options.getImageSrc(item),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.remark),
        d: common_vendor.o(($event) => $options.openMapApp(item), index),
        e: index
      };
    }),
    k: common_vendor.p({
      indicatorWidth: 0
    }),
    l: common_vendor.n($setup.swiperData.length === 1 && "scroll_center")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/学习/小程序/small-project/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
