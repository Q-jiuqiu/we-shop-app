"use strict";
const common_vendor = require("../common/vendor.js");
const QQMapWX = require("../static/qqmap-wx-jssdk.min.js");
function authorizeAgain(callBack) {
  common_vendor.index.getSetting({
    //先查看授权情况
    success: function(res) {
      var statu = res.authSetting;
      if (!statu["scope.userLocation"]) {
        common_vendor.index.showModal({
          title: "需要获取您的地理位置，请确认授权，否则小程序功能将无法使用",
          cancelColor: "需要获取您的地理位置，请确认授权，否则地图功能将无法使用",
          success: function(tip) {
            if (tip.confirm) {
              common_vendor.index.openSetting({
                success: async ({ authSetting }) => {
                  const isLocation = authSetting && authSetting["scope.userLocation"];
                  if (isLocation) {
                    await getLocationInfo();
                    callBack();
                  } else {
                    common_vendor.index.showToast({
                      icon: "none",
                      title: "未授权"
                    });
                  }
                },
                fail: () => {
                  common_vendor.index.showToast({
                    icon: "none",
                    title: "弹出设置面板出错"
                  });
                }
              });
            } else {
              common_vendor.index.showToast({
                title: "授权失败",
                icon: "none",
                duration: 1e3
              });
            }
          }
        });
      }
    }
  });
}
function getLocationInfo(callBack) {
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
  return new Promise((resolve) => {
    common_vendor.index.getLocation({
      type: "gcj02",
      success(res) {
        common_vendor.index.showLoading({ title: "获取位置信息" });
        location.longitude = res.longitude;
        location.latitude = res.latitude;
        const qqmapsdk = new QQMapWX({ key: "NVCBZ-67BCV-7VAP3-56OOQ-P6OQS-A3BZ7" });
        qqmapsdk.reverseGeocoder({
          location,
          success(response) {
            let info = response.result;
            const specialRegion = ["青白江区", "合川区", "江津区", "永川区", "长寿区", "涪陵区", "南川区", "潼南区", "铜梁区", "大足区", "荣昌区", "綦江区", "璧山区"];
            if (specialRegion.includes(info.address_component.district)) {
              location.city = info.address_component.district;
            } else {
              if (info.address_component.district.includes("区")) {
                location.city = info.address_component.city;
              } else {
                location.city = info.address_component.district;
              }
            }
            location.province = info.address_component.province;
            location.district = info.address_component.district;
            location.street = info.address_component.street;
            location.address = info.address;
            common_vendor.index.setStorageSync("location", location);
            common_vendor.index.$emit("locationSave");
            common_vendor.index.hideLoading();
            resolve(location);
          }
        });
      },
      fail(err) {
        common_vendor.index.setStorageSync("location", "noData");
        console.log(err);
        resolve("noData");
      }
    });
  });
}
const authorize = {
  authorizeAgain,
  getLocationInfo
};
exports.authorize = authorize;
