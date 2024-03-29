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
  name: "FoodsIndex",
  components: { CusSelect, CustomNav, customNavBack, Detail, NoData },
  data() {
    return {
      imageList: [],
      contentList: [],
      showDetail: false,
      // 是否展示详情
      isLastPage: false,
      // 是否是最后一页
      curPage: 1,
      // 当前的页数
      filterData: [{ name: "全部美食" }],
      // 类型
      sortList: [{ name: "智能排序" }, { name: "热度" }, { name: "距离" }],
      twoCur: 1,
      // 二级数据类型的当前页
      twoContent: [],
      // 二级数据
      isShowTwo: true,
      // 是否展示二级数据
      isTwoLastPage: true,
      // 二级数据是否是最后一页
      // 三级数据
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
      threeType: ""
      // 三级级类型
    };
  },
  // 监听页面加载
  onLoad: async function() {
    this.getCityInfo();
    const { content } = await this.getFilterDatas();
    this.getTwoDatas();
    if (content.length) {
      this.filterData.push(...content);
    } else {
      this.filterData = [{ name: "全部美食" }];
    }
    this.isShowTwo = true;
    await utils_authorize.authorize.getLocationInfo();
  },
  // 页面上拉触底事件
  onReachBottom: async function() {
    if (this.showDetail) {
      return;
    }
    if (this.isShowTwo) {
      if (this.isTwoLastPage) {
        common_vendor.index.showToast({
          icon: "none",
          title: "没更多数据啦"
        });
      } else {
        this.twoCur++;
        let params = {};
        if (this.secondType) {
          params = { parentName: this.secondType };
        }
        console.log("页面上拉触底事件", params);
        this.getTwoDatas(params);
      }
    } else {
      if (this.isThreeLastPage) {
        common_vendor.index.showToast({
          icon: "none",
          title: "没更多数据啦"
        });
      } else {
        this.threeCur++;
        this.getThreeData({ threeType: this.threeType, city: this.city });
      }
    }
  },
  created() {
    common_vendor.index.$on("locationChange", this.handleCityChange);
    common_vendor.index.$on("locationSave", this.setCity);
  },
  beforeDestroy() {
    common_vendor.index.$off("locationChange", this.handleCityChange);
    common_vendor.index.$off("locationSave", this.setCity);
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
    /**
     * @description  设置城市名称
     */
    async setCity() {
      this.city = common_vendor.index.getStorageSync("location").city;
      this.getCityInfo();
      this.isShowTwo = true;
    },
    /**
     * @description 城市改变
     */
    handleCityChange({ city }) {
      if (this.city === city) {
        return;
      }
      this.city = city;
      this.getCityInfo();
      if (this.isShowTwo) {
        this.twoContent = [];
        this.twoCur = 1;
        this.getTwoDatas();
      } else {
        this.threeContent = [];
        this.threeCur = 1;
        this.getThreeData({ threeType: this.threeType, city: this.city });
      }
      this.$refs.customNav.handleInputClear();
    },
    /**
     * @description 根据城市名称获取城市详细数据
     * @param {string} city
     */
    async getCityInfo() {
      common_vendor.index.request({
        url: `https://www.aomue.cn/dbs/pro/rest/dbs/city/dict/find/${this.city}`,
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
            console.log(this.imageList);
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
      this.twoCur = 1;
      this.twoContent = [];
      this.showInput = true;
      if (!this.isShowTwo && !this.showDetail) {
        this.getTwoDatas();
      } else if (!this.isShowTwo && this.showDetail) {
        this.showDetail = false;
      }
    },
    /**
     * @description 根据关键字搜索
     * @param {String} keyWord
     */
    handleSearch(keyWord) {
      this.threeContent = [];
      this.isShowTwo = false;
      this.threeType = "";
      this.getThreeData({ name: keyWord, city: this.city, type: "美食" });
    },
    /**
     * @description 选中类型
     * @param {number} index 选中下标
     */
    async handleTypeSelect(index) {
      const { name } = this.filterData[index];
      this.isShowTwo = true;
      this.twoContent = [];
      let params = {};
      this.secondType = "";
      this.twoCur = 1;
      if (index !== 0) {
        params = { parentName: name };
        this.secondType = name;
      }
      console.log(params);
      this.getTwoDatas(params);
    },
    /**
     * @description 选中排序
     * @param {number} index 选中下标
     */
    handleSortSelect(index) {
      if (index === 2) {
        for (let i = 0; i < this.threeContent.length; i++) {
          for (let j = i + 1; j < this.threeContent.length; j++) {
            const tmep = this.threeContent[j];
            if (this.threeContent[i].distance >= this.threeContent[j].distance) {
              this.threeContent[j] = this.threeContent[i];
              this.threeContent[i] = tmep;
            }
          }
        }
      } else {
        this.threeContent = this.threeContentCopy;
      }
    },
    /**
     * @description 获取指定二级(小类)数据详情
     * @param {Object} item
     */
    handleTwoDetails(item) {
      if (this.city) {
        this.isShowTwo = false;
        this.threeContent = [];
        this.threeType = item.name;
        this.getThreeData({ threeType: item.name, city: this.city });
      } else {
        utils_authorize.authorize.authorizeAgain();
      }
    },
    /**
     * @description 获取三级数据--二级(小类)详情
     * @param {Object} params 请求条件
     */
    getThreeData(params = {}) {
      common_vendor.index.showLoading({ title: "获取数据中" });
      common_vendor.index.request({
        url: `https://www.aomue.cn/dbs/pro/rest/dbs/find/${this.threeCur}/6`,
        data: params,
        method: "GET",
        success: async (res) => {
          const data = res.data.data;
          const { content, last } = data;
          this.threeContent.push(...content);
          this.isThreeLastPage = last;
          this.isShowTwo = false;
          await this.getDistance({
            longitude: this.location.longitude,
            latitude: this.location.latitude
          });
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          console.log(err);
        }
      });
    },
    // 详情
    handleDetailShow(detail) {
      this.detail = detail;
      this.showInput = false;
      this.showDetail = true;
    },
    // 进入地图
    handleShowMap() {
      common_vendor.index.navigateTo({
        url: "/pages/index/index",
        success: (res) => {
          res.eventChannel.emit("foodMap", { data: this.threeContent });
        }
      });
    },
    /**
     * @description 获取筛选(大类)数据
     */
    getFilterDatas() {
      common_vendor.index.showLoading({ title: "获取数据中" });
      return new Promise((resolve) => {
        common_vendor.index.request({
          url: "https://www.aomue.cn/dbs/pro/rest/dbs/find/dict/one/1/1000?type=美食&level=2",
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
    /**
     * @description 获取二级(小类)数据
     * @param {Object} params 请求条件
     */
    getTwoDatas(params = {}) {
      console.log("城市数据", this.city);
      common_vendor.index.showLoading({ title: "获取数据中" });
      common_vendor.index.request({
        url: `https://www.aomue.cn/dbs/pro/rest/dbs/find/dict/one/${this.twoCur}/6?type=美食&level=3&city=${this.city}`,
        data: params,
        method: "GET",
        success: (res) => {
          const data = res.data.data;
          const { content, last } = data;
          this.twoContent.push(...content);
          this.isTwoLastPage = last;
          this.isShowTwo = true;
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
        }
      });
    },
    // 获取美食数据
    getFoodsData(params = {}) {
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
        for (let item of this.threeContent) {
          if (item.longitude && item.latitude) {
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
              this.threeContent.forEach((item, index) => {
                const distance = distanceInfo[index].distance;
                if (distance === -1) {
                  item.distance = "--";
                } else {
                  item.distance = (distanceInfo[index].distance / 1e3).toFixed(
                    1
                  );
                }
              });
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
    a: $data.showDetail || !$data.isShowTwo
  }, $data.showDetail || !$data.isShowTwo ? {
    b: common_vendor.o($options.handleDetailBack),
    c: common_vendor.p({
      custom: true
    })
  } : {
    d: common_vendor.sr("customNav", "31f9c6b2-1"),
    e: common_vendor.o($options.handleSearch),
    f: common_vendor.p({
      showInput: $data.showInput
    })
  }, {
    g: $data.showDetail
  }, $data.showDetail ? {
    h: common_vendor.sr("detail", "31f9c6b2-2"),
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
      options: $data.filterData
    }),
    o: !$data.isShowTwo
  }, !$data.isShowTwo ? {
    p: common_vendor.o($options.handleSortSelect),
    q: common_vendor.o($options.handleFixStyle),
    r: common_vendor.p({
      options: $data.sortList
    })
  } : {}, {
    s: !$data.isShowTwo
  }, !$data.isShowTwo ? {
    t: common_vendor.o((...args) => $options.handleShowMap && $options.handleShowMap(...args))
  } : {}, {
    v: $data.isShowTwo
  }, $data.isShowTwo ? common_vendor.e({
    w: common_vendor.f($data.twoContent, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.remark),
        d: index,
        e: common_vendor.o(($event) => $options.handleTwoDetails(item), index)
      };
    }),
    x: $data.twoContent.length === 0
  }, $data.twoContent.length === 0 ? {} : {}, {
    y: !$data.isTwoLastPage
  }, !$data.isTwoLastPage ? {} : {}) : common_vendor.e({
    z: common_vendor.f($data.threeContent, (item, index, i0) => {
      return {
        a: item.image1,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.distance),
        d: common_vendor.t(item.introduction),
        e: common_vendor.t(item.environment),
        f: common_vendor.t(item.queue),
        g: common_vendor.t(item.capitaConsumption),
        h: index,
        i: common_vendor.o(($event) => $options.handleDetailShow(item), index)
      };
    }),
    A: $data.threeContent.length === 0
  }, $data.threeContent.length === 0 ? {
    B: common_vendor.p({
      tips: "当前城市暂无数据"
    })
  } : {}, {
    C: !$data.isThreeLastPage
  }, !$data.isThreeLastPage ? {} : {})), {
    D: common_vendor.s($data.fixedStyle)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-31f9c6b2"], ["__file", "/Users/heyuanpeng/个人项目/we-shop-app/pages/foods/foods.vue"]]);
wx.createPage(MiniProgramPage);
