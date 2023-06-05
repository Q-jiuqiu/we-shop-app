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
      markers: [],
      // marker点信息
      foodsDatas: [],
      // 美食数据
      isLocate: false,
      // 是否授权位置
      keyWord: ""
      // 搜索关键字
    };
  },
  onLoad: function() {
    console.log("onload");
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;
    eventChannel.on("foodMap", ({ data }) => {
      console.log(data);
      this.data = data;
    });
  },
  onLoad: async function() {
    common_vendor.index.getStorage({
      key: "location",
      success: async ({ data: storage }) => {
        console.log(storage);
        if (!storage.longitude || !storage.latitude || !storage.city) {
          await this.getLocationInfo();
          this.longitude = location.longitude;
          this.latitude = location.latitude;
          this.locateCity = location.city || "未授权";
          this.isLocate = location.city ? true : false;
          common_vendor.index.setStorage({
            key: "location",
            data: location
          });
        } else {
          this.longitude = storage.longitude;
          this.latitude = storage.latitude;
          this.locateCity = storage.city || "未授权";
          this.isLocate = storage.city ? true : false;
        }
      },
      fail: async ({ errMsg }) => {
        console.log("fail", errMsg);
        this.isLocate = location.city ? true : false;
        if (errMsg === "getStorage:fail data not found") {
          await this.getLocationInfo();
          this.longitude = location.longitude;
          this.latitude = location.latitude;
          this.locateCity = location.city || "未授权";
          common_vendor.index.setStorage({
            key: "location",
            data: location
          });
        }
      },
      complete: async () => {
        this.foodsDatas = await this.getFoodsDatas({ city: this.locateCity });
        this.setMarkers(this.foodsDatas);
      }
    });
  },
  methods: {
    // 授权获取位置信息
    getLocationInfo() {
      return new Promise((resolve) => {
        common_vendor.index.getLocation({
          type: "gcj02",
          success(res) {
            console.log(res, "==");
            location.longitude = res.longitude;
            location.latitude = res.latitude;
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
            console.log(err);
            resolve(location);
          }
        });
      });
    },
    // 获取美食筛选数据
    getFoodsDatas(params = {}) {
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
    setMarkers(points) {
      this.markers = points.map((point, index) => {
        return {
          id: index,
          latitude: Number(point.latitude),
          longitude: Number(point.longitude),
          iconPath: "../../static/location.png",
          width: 35,
          height: 35
        };
      });
      console.log(this.markers);
    },
    // 输入改变
    async handleInputChange() {
      this.foodsDatas = await this.getFoodsDatas({ name: this.keyWord });
      if (this.foodsDatas.length > 0) {
        this.handleMoveTo(this.foodsDatas[0]);
      }
      this.setMarkers(this.foodsDatas);
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
    // 重新授权已授权的信息
    handleLocate() {
      console.log(this.isLocate);
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
                    this.handleMoveTo(location);
                    this.foodsDatas = await this.getFoodsDatas({
                      city: this.locateCity
                    });
                    this.setMarkers(this.foodsDatas);
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
    // marker点击事件
    handleMarkerClick(event) {
      console.log(1111);
      console.log(event);
      const detail = event.detail;
      console.log(detail);
      if (detail && detail.markerId) {
        const foodDetail = this.foodsDatas[detail.markerId];
        common_vendor.index.navigateTo({
          url: "/pages/detail/detail",
          success: (res) => {
            res.eventChannel.emit("foodDetail", { detail: foodDetail });
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.longitude,
    b: $data.latitude,
    c: $data.markers,
    d: common_vendor.o((...args) => $options.handleMarkerClick && $options.handleMarkerClick(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/学习/小程序/small-project/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
