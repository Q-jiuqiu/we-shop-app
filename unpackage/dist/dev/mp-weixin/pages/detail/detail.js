"use strict";
const common_vendor = require("../../common/vendor.js");
const NoData = () => "../../compnnents/noData/noData.js";
const CustomNavBack = () => "../../compnnents/customNavBack/customNavBack.js";
const _sfc_main = {
  name: "detailCom",
  components: { NoData, CustomNavBack },
  data() {
    return {
      tabList: ["简介", "推荐", "评价"],
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
      detailInfo: {}
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
    console.log("onload");
    const eventChannel = this.getOpenerEventChannel();
    this.eventChannel = eventChannel;
    eventChannel.on("detailPage", ({ detail }) => {
      console.log(detail);
      this.detailInfo = detail;
    });
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
          console.log(res);
          res.data.data;
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
    c: $data.detailInfo.workTime
  }, $data.detailInfo.workTime ? {
    d: common_vendor.t($data.isOpen ? "营业中" : "歇业中"),
    e: common_vendor.n({
      close: !$data.isOpen
    }),
    f: common_vendor.t($data.detailInfo.workTime)
  } : {}, {
    g: common_vendor.t($data.detailInfo.addr),
    h: common_vendor.o((...args) => $options.navigatorToMap && $options.navigatorToMap(...args)),
    i: common_vendor.o((...args) => $options.addComment && $options.addComment(...args)),
    j: $data.backTop,
    k: $data.activeTab === 2,
    l: common_vendor.f($data.tabList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.n({
          active: $data.activeTab === index
        }),
        c: index,
        d: common_vendor.o(($event) => $options.handleTabClick(index), index)
      };
    }),
    m: common_vendor.p({
      bgColor: "#fff",
      ["offset-top"]: $options.stickyTop,
      ["bg-color"]: "#f4f4f4"
    }),
    n: common_vendor.t($data.detailInfo.remark),
    o: $data.activeTab === 0,
    p: common_vendor.f($data.recommendData, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.foodName),
        c: common_vendor.t(item.describe),
        d: index
      };
    }),
    q: $data.recommendData.length === 0
  }, $data.recommendData.length === 0 ? {} : {}, {
    r: $data.activeTab === 1,
    s: common_vendor.f($data.commentData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.comment),
        b: index
      };
    }),
    t: $data.commentData.length === 0
  }, $data.commentData.length === 0 ? {} : {}, {
    v: !$data.commentLast
  }, !$data.commentLast ? {} : {}, {
    w: $data.activeTab === 2,
    x: common_vendor.o(($event) => $data.comment = $event),
    y: common_vendor.p({
      placeholder: "请输入评论内容",
      maxlength: -1,
      modelValue: $data.comment
    }),
    z: common_vendor.o($options.close),
    A: common_vendor.p({
      type: "warning",
      plain: true,
      text: "镂空"
    }),
    B: common_vendor.o($options.handleConfirm),
    C: common_vendor.p({
      type: "warning",
      text: "确定"
    }),
    D: common_vendor.o($options.close),
    E: common_vendor.p({
      show: $data.show
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-eca06f3c"], ["__file", "D:/学习/小程序/we-shop-app/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
