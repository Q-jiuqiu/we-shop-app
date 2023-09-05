"use strict";
const common_vendor = require("../../common/vendor.js");
const NoData = () => "../../compnnents/noData/noData.js";
const CustomNavBack = () => "../../compnnents/customNavBack/customNavBack.js";
const _sfc_main = {
  name: "detailCom",
  components: { NoData, CustomNavBack },
  data() {
    return {
      tabList: ["简介", "推荐", "探店", "评价"],
      tabSenseList: ["简介", "票价", "探店", "评价"],
      activeTab: 0,
      recommendData: [],
      commentData: [],
      isOpen: true,
      backTop: common_vendor.index.getStorageSync("menuInfo").windowHeight,
      show: false,
      comment: "",
      commentCur: 1,
      commentLast: true,
      // 评价数据是否是最后一页
      detailInfo: {},
      exploreShopData: [],
      isSense: false,
      faresData: []
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
    }
  },
  onLoad: function() {
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;
    eventChannel.on("detailPage", ({ detail }) => {
      this.detailInfo = detail;
      const type = this.detailInfo.type;
      console.log(type);
      if (type === "风景") {
        this.isSense = true;
      } else {
        this.isSense = false;
      }
    });
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
    // 关闭新增评论弹框
    close() {
      this.show = false;
    },
    // 判断是否在营业中 统一换算成24小时制
    judgeOpen(openingHours) {
      try {
        const date = /* @__PURE__ */ new Date();
        const startTime = openingHours.split("-")[0];
        const endTime = openingHours.split("-")[1];
        const now = date.toLocaleTimeString("chinese", { hour12: false });
        const nowTimes = now.split(":");
        const startTimes = startTime.split(":");
        const endTimes = endTime.split(":");
        const dqdq = date.setHours(nowTimes[0], nowTimes[1]);
        const start = date.setHours(startTimes[0], startTimes[1]);
        const end = date.setHours(endTimes[0], endTimes[1]);
        if (startTimes[0] * 1 > endTimes[0] * 1) {
          return !this.judgeOpen(endTime + "-" + startTime);
        }
        return start < dqdq && dqdq < end;
      } catch (e) {
        return false;
      }
    },
    // 点击tab
    handleTabClick(index) {
      this.activeTab = index;
      console.log(index);
      switch (index) {
        case 1:
          this.getRecommendData();
          break;
        case 2:
          this.getExploreShopData();
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
        url: `https://www.aomue.cn/pro/rest/dbs/exp/find//${this.detailInfo.id}`,
        method: "GET",
        success: (res) => {
          const data = res.data.data;
          this.exploreShopData = data;
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
        url: `https://www.aomue.cn/pro/rest/dbs/find/recommend/${this.detailInfo.id}`,
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
      console.log("增加留言");
      this.show = true;
    },
    // 确认增加
    handleConfirm() {
      console.log(this.detailInfo);
      if (this.comment) {
        common_vendor.index.request({
          url: "https://www.aomue.cn/pro/rest/dbs/add/comment",
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
            tis.comment = "";
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
        url: `https://www.aomue.cn/pro/rest/dbs/find/comment/${this.detailInfo.id}/${this.commentCur}/10`,
        method: "GET",
        success: (res) => {
          const data = res.data.data;
          console.log(res);
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
  const _component_CustomNavBack = common_vendor.resolveComponent("CustomNavBack");
  const _easycom_u_sticky2 = common_vendor.resolveComponent("u-sticky");
  const _component_NoData = common_vendor.resolveComponent("NoData");
  const _easycom_u_textarea2 = common_vendor.resolveComponent("u-textarea");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_component_CustomNavBack + _easycom_u_sticky2 + _component_NoData + _easycom_u_textarea2 + _easycom_u_button2 + _easycom_u_popup2)();
}
const _easycom_u_sticky = () => "../../uni_modules/uview-plus/components/u-sticky/u-sticky.js";
const _easycom_u_textarea = () => "../../uni_modules/uview-plus/components/u-textarea/u-textarea.js";
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
const _easycom_u_popup = () => "../../uni_modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_sticky + _easycom_u_textarea + _easycom_u_button + _easycom_u_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.detailInfo.image,
    b: common_vendor.t($data.detailInfo.name),
    c: $data.isSense
  }, $data.isSense ? {
    d: common_vendor.t($data.detailInfo.threeType)
  } : {}, {
    e: $data.detailInfo.workTime
  }, $data.detailInfo.workTime ? {
    f: common_vendor.t($data.isOpen ? "营业中：" : "歇业中："),
    g: common_vendor.t($data.detailInfo.workTime),
    h: common_vendor.n({
      close: !$data.isOpen
    })
  } : {}, {
    i: common_vendor.t($data.detailInfo.addr),
    j: common_vendor.o((...args) => $options.navigatorToMap && $options.navigatorToMap(...args)),
    k: $data.isSense
  }, $data.isSense ? {} : {}, {
    l: common_vendor.t($data.detailInfo.environment),
    m: $data.isSense
  }, $data.isSense ? {} : {}, {
    n: common_vendor.t($data.detailInfo.queue),
    o: $data.isSense
  }, $data.isSense ? {} : {}, {
    p: common_vendor.t($data.detailInfo.capitaConsumption),
    q: $data.backTop,
    r: $data.activeTab === 3,
    s: common_vendor.o((...args) => $options.addComment && $options.addComment(...args)),
    t: $data.isSense
  }, $data.isSense ? {
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
    x: common_vendor.sr("sticky", "eca06f3c-1"),
    y: common_vendor.p({
      bgColor: "#fff",
      ["offset-top"]: $options.stickyTop,
      ["bg-color"]: "#f4f4f4"
    }),
    z: $data.detailInfo.remark,
    A: $data.activeTab === 0,
    B: $data.isSense
  }, $data.isSense ? {} : common_vendor.e({
    C: common_vendor.f($data.recommendData, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.foodName),
        c: common_vendor.t(item.describe),
        d: index
      };
    }),
    D: $data.recommendData.length === 0
  }, $data.recommendData.length === 0 ? {} : {}), {
    E: $data.activeTab === 1,
    F: common_vendor.f($data.exploreShopData, (item, index, i0) => {
      return {
        a: item.headSculpture,
        b: common_vendor.t(item.name),
        c: index
      };
    }),
    G: $data.activeTab === 2,
    H: common_vendor.f($data.commentData, (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item.comment),
        c: index
      };
    }),
    I: $data.commentData.length === 0
  }, $data.commentData.length === 0 ? {} : {}, {
    J: !$data.commentLast
  }, !$data.commentLast ? {} : {}, {
    K: $data.activeTab === 3,
    L: common_vendor.o(($event) => $data.comment = $event),
    M: common_vendor.p({
      placeholder: "请输入评论内容",
      maxlength: -1,
      modelValue: $data.comment
    }),
    N: common_vendor.o($options.close),
    O: common_vendor.p({
      type: "warning",
      plain: true,
      text: "取消"
    }),
    P: common_vendor.o($options.handleConfirm),
    Q: common_vendor.p({
      type: "warning",
      text: "确认"
    }),
    R: common_vendor.o($options.close),
    S: common_vendor.p({
      show: $data.show
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-eca06f3c"], ["__file", "/Users/heyuanpeng/个人项目/we-shop-app/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
