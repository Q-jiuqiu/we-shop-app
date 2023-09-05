"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_authorize = require("../../utils/authorize.js");
const _sfc_main = {
  name: "customNav",
  props: {
    showInput: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      //状态栏的高度（可以设置为顶部导航条的padding-top）
      statusBarHeight: common_vendor.index.getStorageSync("menuInfo").statusBarHeight,
      surplusWidth: common_vendor.index.getStorageSync("menuInfo").surplusWidth,
      keyWord: "",
      city: common_vendor.index.getStorageSync("location").city || "未授权",
      columns: [],
      show: false,
      columnData: [],
      cityData: []
    };
  },
  created() {
    common_vendor.index.$on("locationSave", this.setCity);
    common_vendor.index.$on("locationChange", this.handleCityChange);
    const cityList = common_vendor.index.getStorageSync("cityList");
    if (cityList) {
      this.columns = cityList;
    } else {
      common_vendor.index.request({
        url: "https://www.aomue.cn/pro/rest/dbs/city/dict/find/tree/-1",
        method: "GET",
        success: (res) => {
          console.log("城市", res.data.data);
          this.cityData = res.data.data;
          res.data.data.forEach((item) => {
            this.columns.push(item.city);
          });
          this.columns = [this.columns];
          console.log("城市1", this.columns);
          common_vendor.index.setStorageSync("cityData", this.cityData);
          common_vendor.index.setStorageSync("cityList", this.columns);
        },
        fail: (err) => {
          console.log(err);
        }
      });
    }
  },
  beforeDestroy() {
    common_vendor.index.$off("locationSave", this.setCity);
    common_vendor.index.$off("locationChange", this.handleCityChange);
  },
  methods: {
    changeHandler(e) {
      const {
        columnIndex,
        value,
        values,
        // values为当前变化列的数组内容
        index,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs.uPicker
      } = e;
      console.log(
        columnIndex,
        value,
        values,
        // values为当前变化列的数组内容
        index
      );
      if (columnIndex === 0) {
        const cityData = common_vendor.index.getStorageSync("cityData");
        cityData.forEach((item) => {
          if (item.city === value[0]) {
            common_vendor.index.request({
              url: `https://www.aomue.cn/pro/rest/dbs/city/dict/find/tree/${item.id}`,
              method: "GET",
              success: (res) => {
                const colums = [];
                res.data.data.forEach((elements) => {
                  colums.push(elements.city);
                });
                common_vendor.index.setStorageSync("cityData1", res.data.data);
                picker.setColumnValues(1, colums);
              },
              fail: (err) => {
                console.log(err);
              }
            });
          }
        });
      }
      if (columnIndex === 1) {
        const cityData1 = common_vendor.index.getStorageSync("cityData1");
        cityData1.forEach((item) => {
          if (item.city === value[1]) {
            common_vendor.index.request({
              url: `https://www.aomue.cn/pro/rest/dbs/city/dict/find/tree/${item.id}`,
              method: "GET",
              success: (res) => {
                const colums = [];
                res.data.data.forEach((elements) => {
                  colums.push(elements.city);
                });
                if (colums.length) {
                  picker.setColumnValues(2, colums);
                }
              },
              fail: (err) => {
                console.log(err);
              }
            });
          }
        });
      }
    },
    // 城市改变
    async handleCityChange({ city }) {
      if (this.city === city) {
        return;
      }
      console.log(city);
      this.handleInputClear();
      this.city = city;
    },
    // 设置城市名称
    setCity() {
      this.city = common_vendor.index.getStorageSync("location").city;
    },
    // 输入改变
    handleInputChange() {
      this.$emit("search", this.keyWord);
    },
    // 清空输入框
    handleInputClear() {
      this.keyWord = "";
    },
    handlePickerShow() {
      if (this.city === "未授权") {
        utils_authorize.authorize.authorizeAgain(this.showPicker);
      } else {
        this.showPicker();
      }
    },
    showPicker() {
      console.log(this);
      if (this.columns.length > 0) {
        this.show = true;
      }
    },
    // picker选中
    handleConfirm(info) {
      console.log(info);
      if (info.value[info.value.length - 1]) {
        this.city = info.value[info.value.length - 1];
      } else {
        this.city = info.value[info.value.length - 2];
      }
      const location = common_vendor.index.getStorageSync("location");
      this.show = false;
      location.city = this.city;
      common_vendor.index.setStorageSync("location", location);
      common_vendor.index.$emit("locationChange", location);
    },
    handleCancel() {
      this.show = false;
    }
  }
};
if (!Array) {
  const _easycom_u_picker2 = common_vendor.resolveComponent("u-picker");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  (_easycom_u_picker2 + _easycom_u_input2)();
}
const _easycom_u_picker = () => "../../uni_modules/uview-plus/components/u-picker/u-picker.js";
const _easycom_u_input = () => "../../uni_modules/uview-plus/components/u-input/u-input.js";
if (!Math) {
  (_easycom_u_picker + _easycom_u_input)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("uPicker", "d0fa9484-0"),
    b: common_vendor.o($options.handleConfirm),
    c: common_vendor.o($options.handleCancel),
    d: common_vendor.o(($event) => $data.show = false),
    e: common_vendor.o($options.changeHandler),
    f: common_vendor.p({
      show: $data.show,
      columns: $data.columns,
      closeOnClickOverlay: true
    }),
    g: common_vendor.t($data.city),
    h: common_vendor.o((...args) => $options.handlePickerShow && $options.handlePickerShow(...args)),
    i: $props.showInput
  }, $props.showInput ? {
    j: common_vendor.o($options.handleInputChange),
    k: common_vendor.o(($event) => $data.keyWord = $event),
    l: common_vendor.p({
      prefixIcon: "search",
      prefixIconStyle: "color: #909399",
      placeholder: "请输入搜索关键词",
      border: "surround",
      shape: "circle",
      modelValue: $data.keyWord
    })
  } : {}, {
    m: $data.surplusWidth,
    n: $data.statusBarHeight,
    o: $data.statusBarHeight
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d0fa9484"], ["__file", "/Users/heyuanpeng/个人项目/we-shop-app/compnnents/customNav/customNav.vue"]]);
wx.createComponent(Component);
