"use strict";
const common_vendor = require("../../common/vendor.js");
const NoData = () => "../noData/noData.js";
const _sfc_main = {
  name: "detailCom",
  components: { NoData },
  props: {
    detailInfo: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      tabList: ["简介", "推荐", "探店", "评价"],
      tabSenseList: ["简介", "推荐", "票价", "评价"],
      activeTab: 0,
      recommendData: [],
      commentData: [],
      isOpen: true,
      backTop: common_vendor.index.getStorageSync("menuInfo").windowHeight,
      show: false,
      comment: "",
      commentCur: 1,
      commentLast: true,
      exploreShopData: [],
      faresData: [],
      popupShow: false
    };
  },
  computed: {
    stickyTop() {
      const statusBarHeight = common_vendor.index.getStorageSync("menuInfo").statusBarHeight;
      let height = 0;
      if (statusBarHeight) {
        height = parseInt(statusBarHeight);
      }
      return height + 44 + "px";
    },
    isSense() {
      return this.detailInfo.type === "风景";
    }
  },
  created() {
    this.isOpen = this.judgeOpen(this.detailInfo.workTime);
  },
  watch: {
    activeTab(newVal) {
      if (newVal === 3) {
        this.$nextTick(() => {
          setTimeout(() => {
            const menuInfo = common_vendor.index.getStorageSync("menuInfo");
            const windowHeight = parseInt(menuInfo.windowHeight);
            const query = common_vendor.index.createSelectorQuery().in(this);
            query.select("#add").boundingClientRect((rect) => {
              const height = rect.height + 2;
              this.backTop = `${windowHeight - height}px`;
            }).exec();
          });
        });
      }
    }
  },
  methods: {
    handelBindLongTap() {
      common_vendor.wx$1.previewImage({
        current: "",
        // 当前显示图片的http链接
        urls: []
        // 需要预览的图片http链接列表
      });
    },
    open() {
      this.popupShow = true;
    },
    popupClose() {
      this.popupShow = false;
    },
    // 关闭新增评论弹框
    close() {
      this.show = false;
    },
    parseTime(timeStr) {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 100 + minutes;
    },
    isTimeInRange(startTimeStr, endTimeStr) {
      const now = /* @__PURE__ */ new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = this.parseTime(startTimeStr);
      const endTime = this.parseTime(endTimeStr);
      return currentTime >= startTime && currentTime <= endTime;
    },
    // 判断是否在营业中 统一换算成24小时制
    judgeOpen(openingHours) {
      const date1 = openingHours.split("与")[0];
      const date2 = openingHours.split("与")[1];
      let jude1 = false;
      let jude2 = false;
      if (date1) {
        const startTime = date1.split("-")[0];
        const endTime = date1.split("-")[1];
        jude1 = this.isTimeInRange(startTime, endTime);
      }
      if (date2) {
        const startTime = date2.split("-")[0];
        const endTime = date2.split("-")[1];
        jude2 = this.isTimeInRange(startTime, endTime);
      }
      console.log(date1, date2, jude1, jude2);
      if (jude1 || jude2) {
        return true;
      } else {
        return false;
      }
    },
    // 点击tab
    handleTabClick(index) {
      this.activeTab = index;
      switch (index) {
        case 1:
          this.getRecommendData();
          break;
        case 2:
          if (this.isSense) {
            this.getFaresData();
          } else {
            this.getExploreShopData();
          }
          break;
        case 3:
          this.commentCur = 1;
          this.commentData = [];
          this.getCommentData();
          break;
      }
    },
    // 获取主播数据
    getExploreShopData() {
      common_vendor.index.showLoading({ title: "获取数据中" });
      common_vendor.index.request({
        url: `https://www.aomue.cn/dbs/pro/rest/dbs/exp/find/${this.detailInfo.id}`,
        method: "GET",
        success: (res) => {
          console.log(res.data);
          const data = res.data.data;
          this.exploreShopData = data;
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          console.log(err);
        }
      });
    },
    // 获取票价数据
    getFaresData() {
      common_vendor.index.showLoading({ title: "获取数据中" });
      common_vendor.index.request({
        url: `https://www.aomue.cn/dbs/pro/rest/dbs/fares/find/${this.detailInfo.id}`,
        method: "GET",
        success: (res) => {
          const data = res.data.data;
          this.faresData = data;
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          console.log(err);
        }
      });
    },
    // 获取推荐数据
    getRecommendData() {
      common_vendor.index.showLoading({ title: "获取数据中" });
      common_vendor.index.request({
        url: `https://www.aomue.cn/dbs/pro/rest/dbs/find/recommend/${this.detailInfo.id}`,
        method: "GET",
        success: (res) => {
          const data = res.data.data;
          this.recommendData = data;
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          console.log(err);
        }
      });
    },
    // 增加留言
    addComment() {
      this.show = true;
    },
    // 确认增加
    handleConfirm() {
      if (this.comment) {
        common_vendor.index.request({
          url: "https://www.aomue.cn/dbs/pro/rest/dbs/add/comment",
          data: {
            productId: this.detailInfo.id,
            comment: this.comment
          },
          method: "POST",
          success: ({ data }) => {
            this.close();
            this.commentCur = 1;
            this.commentData = [];
            this.getCommentData();
            this.comment = "";
          },
          fail: (err) => {
            console.log(err);
          }
        });
      } else {
        common_vendor.index.showToast({
          icon: "none",
          title: "评论未空"
        });
      }
    },
    // 打开地图
    navigatorToMap() {
      common_vendor.index.navigateTo({
        url: "/pages/map/map",
        success: (res) => {
          res.eventChannel.emit("postMap", { detail: this.detailInfo });
        }
      });
    },
    // 获取评价数据
    getCommentData() {
      common_vendor.index.showLoading({ title: "获取数据中" });
      common_vendor.index.request({
        url: `https://www.aomue.cn/dbs/pro/rest/dbs/find/comment/${this.detailInfo.id}/${this.commentCur}/10`,
        method: "GET",
        success: (res) => {
          const data = res.data.data;
          this.commentData.push(...data.content);
          this.commentLast = data.last;
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          console.log(err);
        }
      });
    },
    // 获取下一页评价数据
    getLastComment() {
      if (this.activeTab === 2) {
        if (!this.commentLast) {
          this.commentCur++;
          this.getCommentData();
        } else {
          common_vendor.index.showToast({
            icon: "none",
            title: "没更多数据啦"
          });
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_u_sticky2 = common_vendor.resolveComponent("u-sticky");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  const _component_NoData = common_vendor.resolveComponent("NoData");
  const _easycom_u_textarea2 = common_vendor.resolveComponent("u-textarea");
  (_easycom_u_sticky2 + _easycom_u_button2 + _easycom_u_popup2 + _component_NoData + _easycom_u_textarea2)();
}
const _easycom_u_sticky = () => "../../uni_modules/uview-plus/components/u-sticky/u-sticky.js";
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_popup = () => "../../uni_modules/uview-plus/components/u-popup/u-popup.js";
const _easycom_u_textarea = () => "../../uni_modules/uview-plus/components/u-textarea/u-textarea.js";
if (!Math) {
  (_easycom_u_sticky + _easycom_u_button + _easycom_u_popup + _easycom_u_textarea)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.detailInfo.image2,
    b: common_vendor.t($props.detailInfo.name),
    c: $options.isSense
  }, $options.isSense ? {
    d: common_vendor.t($props.detailInfo.threeType)
  } : {}, {
    e: $props.detailInfo.workTime
  }, $props.detailInfo.workTime ? {
    f: common_vendor.t($data.isOpen ? "营业中：" : "歇业中："),
    g: common_vendor.t($props.detailInfo.workTime),
    h: common_vendor.n({
      close: !$data.isOpen
    })
  } : {}, {
    i: common_vendor.t($props.detailInfo.addr),
    j: common_vendor.o((...args) => $options.navigatorToMap && $options.navigatorToMap(...args)),
    k: $options.isSense
  }, $options.isSense ? {} : {}, {
    l: common_vendor.t($props.detailInfo.environment),
    m: $options.isSense
  }, $options.isSense ? {} : {}, {
    n: common_vendor.t($props.detailInfo.queue),
    o: $options.isSense
  }, $options.isSense ? {} : {}, {
    p: common_vendor.t($props.detailInfo.capitaConsumption),
    q: $data.backTop,
    r: $data.activeTab === 3,
    s: common_vendor.o((...args) => $options.addComment && $options.addComment(...args)),
    t: $options.isSense
  }, $options.isSense ? {
    v: common_vendor.f($data.tabSenseList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.n({
          active: $data.activeTab === index
        }),
        c: index,
        d: common_vendor.o(($event) => $options.handleTabClick(index), index)
      };
    })
  } : {
    w: common_vendor.f($data.tabList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.n({
          active: $data.activeTab === index
        }),
        c: index,
        d: common_vendor.o(($event) => $options.handleTabClick(index), index)
      };
    })
  }, {
    x: common_vendor.sr("sticky", "a6d5e4bb-0"),
    y: common_vendor.p({
      bgColor: "#fff",
      ["offset-top"]: $options.stickyTop,
      ["bg-color"]: "#f4f4f4"
    }),
    z: $props.detailInfo.remark,
    A: $data.activeTab === 0,
    B: common_vendor.f($data.recommendData, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.foodName),
        c: index
      };
    }),
    C: $data.activeTab === 1,
    D: $options.isSense && $data.faresData.length
  }, $options.isSense && $data.faresData.length ? {
    E: common_vendor.o($options.open),
    F: common_vendor.p({
      type: "primary"
    }),
    G: $props.detailInfo.paymentCode,
    H: common_vendor.o($options.popupClose),
    I: common_vendor.p({
      show: $data.popupShow,
      closeable: true
    }),
    J: common_vendor.f($data.faresData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.adult),
        b: common_vendor.t(item.elder),
        c: common_vendor.t(item.child),
        d: index
      };
    })
  } : {
    K: common_vendor.f($data.exploreShopData, (item, index, i0) => {
      return {
        a: item.pictrue,
        b: common_vendor.t(item.entName),
        c: index
      };
    })
  }, {
    L: $data.activeTab === 2,
    M: common_vendor.f($data.commentData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.comment),
        b: index
      };
    }),
    N: $data.commentData.length === 0
  }, $data.commentData.length === 0 ? {} : {}, {
    O: !$data.commentLast
  }, !$data.commentLast ? {} : {}, {
    P: $data.activeTab === 3,
    Q: common_vendor.o(($event) => $data.comment = $event),
    R: common_vendor.p({
      placeholder: "请输入评论内容",
      maxlength: -1,
      modelValue: $data.comment
    }),
    S: common_vendor.o($options.close),
    T: common_vendor.p({
      type: "warning",
      plain: true,
      text: "取消"
    }),
    U: common_vendor.o($options.handleConfirm),
    V: common_vendor.p({
      type: "warning",
      text: "确认"
    }),
    W: common_vendor.o($options.close),
    X: common_vendor.p({
      show: $data.show
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a6d5e4bb"], ["__file", "/Users/heyuanpeng/个人项目/小项目/we-shop-app/compnnents/detail/detail.vue"]]);
wx.createComponent(Component);
