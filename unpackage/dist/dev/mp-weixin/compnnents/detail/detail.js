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
      tabList: ["简介", "推荐", "主播", "评价"],
      activeTab: 0,
      recommendData: [],
      commentData: [],
      isOpen: true,
      backTop: common_vendor.index.getStorageSync("menuInfo").windowHeight,
      show: false,
      comment: "",
      commentCur: 1,
      commentLast: true
      // 评价数据是否是最后一页
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
      return detailInfo.type === "风景";
    }
  },
  created() {
    this.isOpen = this.judgeOpen(this.detailInfo.workTime);
  },
  watch: {
    activeTab(newVal) {
      console.log("newVal", newVal);
      if (newVal === 2) {
        this.$nextTick(() => {
          setTimeout(() => {
            console.log("this", this);
            const menuInfo = common_vendor.index.getStorageSync("menuInfo");
            const windowHeight = parseInt(menuInfo.windowHeight);
            const query = common_vendor.index.createSelectorQuery().in(this);
            query.select("#add").boundingClientRect((rect) => {
              console.log("backTop:", rect);
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
      console.log("close");
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
          console.log("第二天");
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
      switch (index) {
        case 1:
          this.getRecommendData();
          break;
        case 2:
          this.commentCur = 1;
          this.commentData = [];
          this.getCommentData();
          break;
      }
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
  const _easycom_u_sticky2 = common_vendor.resolveComponent("u-sticky");
  const _component_NoData = common_vendor.resolveComponent("NoData");
  const _easycom_u_textarea2 = common_vendor.resolveComponent("u-textarea");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_sticky2 + _component_NoData + _easycom_u_textarea2 + _easycom_u_button2 + _easycom_u_popup2)();
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
    a: $props.detailInfo.image,
    b: common_vendor.t($props.detailInfo.name),
    c: $props.detailInfo.workTime
  }, $props.detailInfo.workTime ? common_vendor.e({
    d: common_vendor.t($data.isOpen ? "营业中：" : "歇业中："),
    e: common_vendor.n({
      close: !$data.isOpen
    }),
    f: common_vendor.t($props.detailInfo.workTime),
    g: $options.isSense
  }, $options.isSense ? {} : {}, {
    h: $options.isSense
  }, $options.isSense ? {
    i: common_vendor.t($props.detailInfo.threeType)
  } : {}) : {}, {
    j: common_vendor.t($props.detailInfo.addr),
    k: common_vendor.o((...args) => $options.navigatorToMap && $options.navigatorToMap(...args)),
    l: $data.backTop,
    m: $data.activeTab === 2,
    n: common_vendor.o((...args) => $options.addComment && $options.addComment(...args)),
    o: common_vendor.f($data.tabList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.n({
          active: $data.activeTab === index
        }),
        c: index,
        d: common_vendor.o(($event) => $options.handleTabClick(index), index)
      };
    }),
    p: common_vendor.sr("sticky", "a6d5e4bb-0"),
    q: common_vendor.p({
      bgColor: "#fff",
      ["offset-top"]: $options.stickyTop,
      ["bg-color"]: "#f4f4f4"
    }),
    r: $props.detailInfo.remark,
    s: $data.activeTab === 0,
    t: $options.isSense
  }, $options.isSense ? {} : common_vendor.e({
    v: common_vendor.f($data.recommendData, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.foodName),
        c: common_vendor.t(item.describe),
        d: index
      };
    }),
    w: $data.recommendData.length === 0
  }, $data.recommendData.length === 0 ? {} : {}), {
    x: $data.activeTab === 1,
    y: $data.activeTab === 2,
    z: common_vendor.f($data.commentData, (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item.comment),
        c: index
      };
    }),
    A: $data.commentData.length === 0
  }, $data.commentData.length === 0 ? {} : {}, {
    B: !$data.commentLast
  }, !$data.commentLast ? {} : {}, {
    C: $data.activeTab === 3,
    D: common_vendor.o(($event) => $data.comment = $event),
    E: common_vendor.p({
      placeholder: "请输入评论内容",
      maxlength: -1,
      modelValue: $data.comment
    }),
    F: common_vendor.o($options.close),
    G: common_vendor.p({
      type: "warning",
      plain: true,
      text: "取消"
    }),
    H: common_vendor.o($options.handleConfirm),
    I: common_vendor.p({
      type: "warning",
      text: "确认"
    }),
    J: common_vendor.o($options.close),
    K: common_vendor.p({
      show: $data.show
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a6d5e4bb"], ["__file", "D:/学习/小程序/we-shop-app/compnnents/detail/detail.vue"]]);
wx.createComponent(Component);
