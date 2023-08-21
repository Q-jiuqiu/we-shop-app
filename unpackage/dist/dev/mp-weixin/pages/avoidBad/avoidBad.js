"use strict";
const common_vendor = require("../../common/vendor.js");
const NoData = () => "../../compnnents/noData/noData.js";
const CustomNav = () => "../../compnnents/customNav/customNav.js";
const _sfc_main = {
  name: "avoidBad",
  components: { NoData, CustomNav },
  data() {
    return {
      foodData: [],
      foodCur: 1,
      // 美食数据的当前页
      foodLast: true,
      // 美食数据是否到最后一页
      senseData: [],
      senseCur: 1,
      // 风景数据的当前页
      senseLast: true,
      list: ["美食", "景点"],
      curNow: 0,
      city: common_vendor.index.getStorageSync("location").city
    };
  },
  onLoad: function() {
    this.getData({ type: "美食" });
  },
  // 页面上拉触底事件
  onReachBottom: async function() {
    console.log("到底部啦");
    if (this.curNow === 0) {
      if (this.foodLast) {
        common_vendor.index.showToast({
          icon: "none",
          title: "没更多数据啦"
        });
      } else {
        this.foodCur++;
        this.getData({ type: "美食" });
      }
    } else {
      if (this.senseLast) {
        common_vendor.index.showToast({
          icon: "none",
          title: "没更多数据啦"
        });
      } else {
        this.senseCur++;
        this.getData({ type: "风景" });
      }
    }
  },
  onHide: function() {
    common_vendor.index.$off("locationChange", this.handleCityChange);
    common_vendor.index.$off("locationSave", this.setCity);
  },
  onShow: function() {
    common_vendor.index.$on("locationChange", this.handleCityChange);
    common_vendor.index.$on("locationSave", this.setCity);
  },
  methods: {
    // 设置城市名称
    setCity() {
      this.city = common_vendor.index.getStorageSync("location").city;
    },
    // 城市改变
    async handleCityChange({ city }) {
      if (this.city === city) {
        return;
      }
      this.city = city;
      this.foodCur = 1;
      this.foodData = [];
      this.senseCur = 1;
      this.senseData = [];
      this.getData({ type: this.list[this.curNow] });
    },
    /**
     * @description 获取美食或者风景的避坑数据
     * @param {Object} params 筛选条件
     */
    getData(params = {}) {
      params.city = this.city;
      let curPage = this.foodCur;
      if (params.type === "风景") {
        curPage = this.senseCur;
      }
      common_vendor.index.request({
        url: `https://www.aomue.cn/pro/rest/dbs/find/escape/pit/${curPage}/10`,
        data: params,
        method: "GET",
        success: ({ data }) => {
          const result = data.data;
          if (params.type === "美食") {
            this.foodData.push(...result.content);
            this.foodLast = result.last;
          } else {
            this.senseData.push(...result.content);
            this.senseLast = result.last;
          }
          console.log(this.foodData, this.senseData);
        },
        fail: (err) => {
          console.log(err);
        }
      });
    },
    sectionChange(index) {
      this.curNow = index;
      if (index === 0 && this.foodData.length === 0 || index === 1 && this.senseData.length === 0) {
        this.getData({ type: this.list[index] });
      }
    }
  }
};
if (!Array) {
  const _component_CustomNav = common_vendor.resolveComponent("CustomNav");
  const _easycom_u_subsection2 = common_vendor.resolveComponent("u-subsection");
  const _component_NoData = common_vendor.resolveComponent("NoData");
  (_component_CustomNav + _easycom_u_subsection2 + _component_NoData)();
}
const _easycom_u_subsection = () => "../../uni_modules/uview-plus/components/u-subsection/u-subsection.js";
if (!Math) {
  _easycom_u_subsection();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      showInput: false
    }),
    b: common_vendor.o($options.sectionChange),
    c: common_vendor.p({
      activeColor: "#f9ae3d",
      list: $data.list,
      current: $data.curNow
    }),
    d: $data.curNow === 0
  }, $data.curNow === 0 ? common_vendor.e({
    e: $data.foodData.length > 0
  }, $data.foodData.length > 0 ? {
    f: common_vendor.f($data.foodData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.leaveWord),
        b: index
      };
    })
  } : {}, {
    g: !$data.foodLast
  }, !$data.foodLast ? {} : {}) : common_vendor.e({
    h: $data.senseData.length > 0
  }, $data.senseData.length > 0 ? {
    i: common_vendor.f($data.senseData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.leaveWord),
        b: index
      };
    })
  } : {}, {
    j: !$data.senseLast
  }, !$data.senseLast ? {} : {}));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d726279d"], ["__file", "/Users/heyuanpeng/Desktop/small-project/pages/avoidBad/avoidBad.vue"]]);
wx.createPage(MiniProgramPage);
