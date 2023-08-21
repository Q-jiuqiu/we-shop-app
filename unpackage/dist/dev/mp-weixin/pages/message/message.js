"use strict";
const common_vendor = require("../../common/vendor.js");
const CustomNav = () => "../../compnnents/customNav/customNav.js";
const _sfc_main = {
  name: "MessageIndex",
  components: { CustomNav },
  data() {
    return {
      value: "",
      btnLoading: false
    };
  },
  methods: {
    // 清空输入框
    handleInputClear() {
      this.value = "";
    },
    // 保存留言
    handleSaveMessage() {
      if (this.value) {
        this.btnLoading = true;
        common_vendor.index.request({
          url: "https://www.aomue.cn/pro/rest/dbs/add/leave/word",
          method: "POST",
          data: { leaveWord: this.value },
          success: (res) => {
            common_vendor.index.showToast({
              icon: "success",
              title: "留言成功"
            });
            this.handleInputClear();
          },
          fail: (err) => {
            console.log(err);
            this.$refs.uNotify.show({
              type: "warning",
              message: "留言失败",
              duration: 1e3,
              safeAreaInsetTop: true
            });
          },
          complete: () => {
            this.btnLoading = false;
          }
        });
      }
      console.log(this.value);
    }
  }
};
if (!Array) {
  const _component_CustomNav = common_vendor.resolveComponent("CustomNav");
  const _easycom_u_textarea2 = common_vendor.resolveComponent("u-textarea");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  (_component_CustomNav + _easycom_u_textarea2 + _easycom_u_button2)();
}
const _easycom_u_textarea = () => "../../uni_modules/uview-plus/components/u-textarea/u-textarea.js";
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_textarea + _easycom_u_button)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      showInput: false
    }),
    b: common_vendor.o(($event) => $data.value = $event),
    c: common_vendor.p({
      placeholder: "请输入留言内容",
      maxlength: -1,
      modelValue: $data.value
    }),
    d: common_vendor.o($options.handleInputClear),
    e: common_vendor.p({
      type: "warning",
      plain: true,
      text: "镂空"
    }),
    f: common_vendor.o($options.handleSaveMessage),
    g: common_vendor.p({
      type: "warning",
      text: "确定",
      loading: $data.btnLoading
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4c1b26cf"], ["__file", "D:/学习/小程序/we-shop-app/pages/message/message.vue"]]);
wx.createPage(MiniProgramPage);
