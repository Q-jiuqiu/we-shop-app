"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_authorize = require("../../utils/authorize.js");
const QQMapWX = require("../../static/qqmap-wx-jssdk.min.js");
const NoData = () => "../../compnnents/noData/noData.js";
const CusSelect = () => "../../compnnents/select/select.js";
const CustomNav = () => "../../compnnents/customNav/customNav.js";
const customNavBack = () => "../../compnnents/customNavBack/customNavBack.js";
const Detail = () => "../../compnnents/detail/detail.js";
const _sfc_main = {
  name: "SenseIndex",
  components: { CusSelect, CustomNav, customNavBack, Detail, NoData },
  data() {
    return {
      imageList: [],
      cityDes: "",
      contentList: [],
      showDetail: false,
      // 是否展示详情
      isLastPage: false,
      // 是否是最后一页
      curPage: 1,
      // 当前的页数
      typeList: [{ name: "全部景点" }],
      // 类型
      sortList: [{ name: "智能排序" }, { name: "热度" }, { name: "距离" }],
      freeList: [{ name: "是否免费" }, { name: "付费" }, { name: "免费" }],
      threeCur: 1,
      threeContent: [],
      threeContentCopy: [],
      // 用以排序
      isThreeLastPage: true,
      // 详情
      detail: {},
      location: common_vendor.index.getStorageSync("location"),
      // 位置信息
      city: common_vendor.index.getStorageSync("location").city,
      showInput: true,
      // 是否展示搜索框
      fixedStyle: {},
      secondType: "",
      // 二级类型
      threeContentKb: [],
      freeSorting: ""
    };
  },
  // 监听页面加载
  onLoad: async function() {
    this.getCityInfo();
    const { content, last } = await this.getOneDatas();
    this.typeList.push(...content);
    await this.getThreeData({ isFree: this.freeSorting, city: this.city, type: "风景" });
    common_vendor.wx$1.onShareAppMessage(() => {
      return {
        title: "全游记：带你吃喝玩乐"
      };
    });
    common_vendor.wx$1.onShareTimeline(() => {
      return {
        title: "全游记：带你吃喝玩乐"
      };
    });
  },
  created() {
    common_vendor.index.$on("locationChange", this.handleCityChange);
    common_vendor.index.$on("locationSave", this.setCity);
  },
  beforeDestroy() {
    common_vendor.index.$off("locationChange", this.handleCityChange);
    common_vendor.index.$off("locationSave", this.setCity);
  },
  // 页面上拉触底事件
  onReachBottom: async function() {
    if (this.showDetail) {
      this.$refs.detail && this.$refs.detail.getLastComment();
    } else {
      if (!this.isThreeLastPage) {
        this.threeCur++;
        await this.getThreeData({ isFree: this.freeSorting, secondType: this.secondType, city: this.city, type: "风景" });
      } else {
        common_vendor.index.showToast({
          icon: "none",
          title: "没更多数据啦"
        });
      }
    }
  },
  methods: {
    // 调整根节点样式
    handleFixStyle(style) {
      this.fixedStyle = style;
    },
    // 跳转至城市详情页
    navigateCityInfo() {
      common_vendor.index.navigateTo({
        url: "/pages/cityInfo/cityInfo",
        success: (res) => {
          res.eventChannel.emit("cityInfo", {
            cityInfo: {
              imageList: this.imageList,
              cityDes: this.cityDes
            }
          });
        }
      });
    },
    // 设置城市名称
    setCity() {
      this.city = common_vendor.index.getStorageSync("location").city;
      this.getCityInfo();
      this.threeContent = [];
      this.threeCur = 1;
      const params = {
        city: this.city,
        type: "风景"
      };
      if (this.secondType) {
        params.secondType = this.secondType;
      }
      this.getThreeData(params);
    },
    // 城市改变
    async handleCityChange({ city }) {
      var _a;
      if (this.city === city) {
        return;
      }
      (_a = this.$refs.customNav) == null ? void 0 : _a.handleInputClear();
      this.city = city;
      if (!this.isShowTwo) {
        this.threeContent = [];
        this.threeCur = 1;
        const params = {
          city: this.city,
          type: "风景"
        };
        if (this.secondType) {
          params.secondType = this.secondType;
        }
        await this.getThreeData(params);
        this.getCityInfo();
      }
    },
    /**
     * @description 根据城市名称获取城市详细数据
     * @param {string} city
     */
    getCityInfo() {
      common_vendor.index.request({
        url: `https://www.aomue.cn/dbs/pro/rest/dbs/city/dict/find/yd/${this.city}`,
        method: "GET",
        success: ({ data }) => {
          const info = data.data;
          if (info) {
            this.imageList = [];
            const keys = Object.keys(info);
            for (let key of keys) {
              if (key.indexOf("image") >= 0 && info[key]) {
                this.imageList.push(info[key]);
              }
            }
            this.cityDes = info.remark;
          }
        },
        fail: (err) => {
          console.log(err);
        }
      });
    },
    // 详情返回
    handleDetailBack() {
      this.showDetail = false;
      this.showInput = true;
    },
    /**
     * @description 根据关键字搜索
     * @param {String} keyWord
     */
    async handleSearch(keyWord) {
      this.threeContent = [];
      this.isShowTwo = false;
      await this.getThreeData({ name: keyWord, city: this.city, type: "风景" });
    },
    /**
     * @description 选中类型
     * @param {number} index 选中下标
     */
    async handleTypeSelect(index) {
      const { name } = this.typeList[index];
      this.isShowTwo = true;
      const params = { city: this.city, type: "风景" };
      this.threeCur = 1;
      if (index !== 0) {
        params.secondType = name;
        this.secondType = name;
      } else {
        this.secondType = "";
      }
      this.threeContent = [];
      await this.getThreeData(params);
    },
    /**
     * @description 选中排序
     * @param {number} index 选中下标
     */
    handleSortSelect(index) {
      if (index === 2) {
        this.threeContent.sort(function(a, b) {
          var distanceA = parseFloat(a.distance);
          var distanceB = parseFloat(b.distance);
          if (distanceA < distanceB) {
            return -1;
          }
          if (distanceA > distanceB) {
            return 1;
          }
          return 0;
        });
      } else if (index === 1) {
        this.threeContent.sort(function(a, b) {
          var distanceA = parseFloat(a.heat);
          var distanceB = parseFloat(b.heat);
          if (distanceA > distanceB) {
            return -1;
          }
          if (distanceA < distanceB) {
            return 1;
          }
          return 0;
        });
      } else {
        this.threeContent = this.threeContentCopy;
      }
    },
    /**
     * @description 选中是否免费
     * @param {number} index 
     */
    handleFreeSelect(index) {
      console.log(index);
      this.threeContent = [];
      this.threeCur = 1;
      if (index === 2) {
        this.freeSorting = "是";
        this.getThreeData({ isFree: "是", city: this.city, type: "风景" });
      } else if (index === 1) {
        this.freeSorting = "否";
        this.getThreeData({ isFree: "否", city: this.city, type: "风景" });
      } else {
        this.getThreeData({ city: this.city, type: "风景" });
      }
    },
    /**
     * @description 获取指定分类数据
     * @param {Object} item
     */
    async handleTowData(item) {
      if (this.city) {
        this.threeContent = [];
        this.secondType = item.name;
        await this.getThreeData({ secondType: item.name, city: this.city, type: "风景" });
      } else {
        utils_authorize.authorize.authorizeAgain();
      }
    },
    // 获取三级数据
    async getThreeData(params = {}) {
      common_vendor.index.showLoading({ title: "获取数据中", mask: true });
      const res = await this.getSenseData(params);
      this.threeContent.push(...res.content);
      this.isThreeLastPage = res.last;
      console.log(this.threeContent);
      this.threeContentKb = JSON.parse(JSON.stringify(this.threeContent));
      this.isShowTwo = false;
      await this.getDistance({
        longitude: this.location.longitude,
        latitude: this.location.latitude
      });
      common_vendor.index.hideLoading();
    },
    // 详情
    handleDetailShow(detail) {
      this.detail = detail;
      this.showDetail = true;
      this.showInput = false;
    },
    // 进入地图
    handleShowMap() {
      common_vendor.index.navigateTo({
        url: "/pages/index/index",
        success: (res) => {
          res.eventChannel.emit("foodMap", { data: this.threeContent, city: this.city, index: 100, type: "风景", threeType: this.secondType });
        }
      });
    },
    // 获取风景二级分类数据
    getOneDatas() {
      common_vendor.index.showLoading({ title: "获取数据中", mask: true });
      return new Promise((resolve) => {
        common_vendor.index.request({
          url: "https://www.aomue.cn/dbs/pro/rest/dbs/find/dict/one/1/1000?type=风景&level=2",
          method: "GET",
          success: (res) => {
            const data = res.data.data;
            common_vendor.index.hideLoading();
            resolve(data);
          },
          fail: (err) => {
            resolve([]);
          }
        });
      });
    },
    // 获取风景数据
    getSenseData(params = {}) {
      return new Promise((resolve) => {
        common_vendor.index.request({
          url: `https://www.aomue.cn/dbs/pro/rest/dbs/find/${this.threeCur}/6`,
          data: params,
          method: "GET",
          success: (res) => {
            const data = res.data.data;
            resolve(data);
          },
          fail: (err) => {
            console.log(err);
            resolve([]);
          }
        });
      });
    },
    // 获取距离
    getDistance({ longitude, latitude }) {
      if (this.threeContent.length > 0) {
        const toList = [];
        const start = (this.threeCur - 1) * 6;
        for (let i = start; i < this.threeContent.length; i++) {
          const item = this.threeContent[i];
          if (item.longitude && item.latitude && !item.distance) {
            toList.push({
              longitude: Number(item.longitude),
              latitude: Number(item.latitude)
            });
          }
        }
        if (toList.length > 0) {
          const qqmapsdk = new QQMapWX({ key: "NVCBZ-67BCV-7VAP3-56OOQ-P6OQS-A3BZ7" });
          qqmapsdk.calculateDistance({
            from: {
              longitude,
              // 经度
              latitude
              // 纬度
            },
            to: toList,
            success: ({ result }) => {
              const distanceInfo = result.elements;
              for (let i = 0; i < distanceInfo.length; i++) {
                const distance = distanceInfo[i].distance;
                if (distance === -1) {
                  this.threeContent[start + i].distance = "--";
                } else {
                  this.threeContent[start + i].distance = (distance / 1e3).toFixed(1);
                }
              }
              this.threeContentCopy = JSON.parse(JSON.stringify(this.threeContent));
            },
            fail: function(error) {
              console.error(error);
            }
          });
        }
      }
    }
  }
};
if (!Array) {
  const _component_customNavBack = common_vendor.resolveComponent("customNavBack");
  const _component_CustomNav = common_vendor.resolveComponent("CustomNav");
  const _component_Detail = common_vendor.resolveComponent("Detail");
  const _easycom_u_swiper2 = common_vendor.resolveComponent("u-swiper");
  const _component_CusSelect = common_vendor.resolveComponent("CusSelect");
  const _component_NoData = common_vendor.resolveComponent("NoData");
  (_component_customNavBack + _component_CustomNav + _component_Detail + _easycom_u_swiper2 + _component_CusSelect + _component_NoData)();
}
const _easycom_u_swiper = () => "../../uni_modules/uview-plus/components/u-swiper/u-swiper.js";
if (!Math) {
  _easycom_u_swiper();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showDetail
  }, $data.showDetail ? {
    b: common_vendor.o($options.handleDetailBack),
    c: common_vendor.p({
      custom: true
    })
  } : {
    d: common_vendor.sr("customNav", "052ffb32-1"),
    e: common_vendor.o($options.handleSearch),
    f: common_vendor.p({
      showInput: $data.showInput
    })
  }, {
    g: $data.showDetail
  }, $data.showDetail ? {
    h: common_vendor.o($options.handleDetailBack),
    i: common_vendor.p({
      detailInfo: $data.detail
    })
  } : common_vendor.e({
    j: common_vendor.p({
      list: [$data.imageList[0]]
    }),
    k: common_vendor.o((...args) => $options.navigateCityInfo && $options.navigateCityInfo(...args)),
    l: common_vendor.o($options.handleTypeSelect),
    m: common_vendor.o($options.handleFixStyle),
    n: common_vendor.p({
      selectName: "type",
      options: $data.typeList
    }),
    o: common_vendor.o($options.handleSortSelect),
    p: common_vendor.o($options.handleFixStyle),
    q: common_vendor.p({
      selectName: "sort",
      options: $data.sortList
    }),
    r: common_vendor.o($options.handleFreeSelect),
    s: common_vendor.o($options.handleFixStyle),
    t: common_vendor.p({
      selectName: "sort",
      options: $data.freeList
    }),
    v: common_vendor.o((...args) => $options.handleShowMap && $options.handleShowMap(...args)),
    w: common_vendor.f($data.threeContent, (item, index, i0) => {
      return common_vendor.e({
        a: item.image1,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.distance),
        d: common_vendor.t(item.introduction),
        e: common_vendor.t(item.environment),
        f: item.capitaConsumption === "0"
      }, item.capitaConsumption === "0" ? {} : {
        g: common_vendor.t(item.capitaConsumption)
      }, {
        h: index,
        i: common_vendor.o(($event) => $options.handleDetailShow(item), index)
      });
    }),
    x: $data.threeContent.length === 0
  }, $data.threeContent.length === 0 ? {
    y: common_vendor.p({
      tips: "当前城市暂无数据"
    })
  } : {}, {
    z: !$data.isThreeLastPage
  }, !$data.isThreeLastPage ? {} : {}), {
    A: common_vendor.s($data.fixedStyle)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-052ffb32"], ["__file", "/Users/heyuanpeng/个人项目/小项目/we-shop-app/pages/sense/sense.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
