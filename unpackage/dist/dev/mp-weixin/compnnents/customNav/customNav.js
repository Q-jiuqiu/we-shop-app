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
      cityData: [],
      pickerLoading: false,
      pickerTitle: ""
    };
  },
  created() {
    common_vendor.index.$on("locationSave", this.setCity);
    common_vendor.index.$on("locationChange", this.handleCityChange);
    console.log(common_vendor.index.getStorageSync("location").city);
    const cityList = common_vendor.index.getStorageSync("cityList");
    if (cityList) {
      this.columns = cityList;
    } else {
      common_vendor.index.request({
        url: "https://www.aomue.cn/dbs/pro/rest/dbs/city/dict/find/tree/-1",
        method: "GET",
        success: (res) => {
          this.cityData = res.data.data;
          res.data.data.forEach((item) => {
            this.columns.push(item.city);
          });
          this.columns = [this.columns];
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
    /**
    	* @description: 选择行政区划
    	* @param {*} e
    	* @return {*}
    	*/
    changeHandler(e) {
      const {
        columnIndex,
        value,
        values,
        picker = this.$refs.uPicker
      } = e;
      if (columnIndex === 0) {
        const cityData = common_vendor.index.getStorageSync("cityData");
        cityData.forEach((item) => {
          if (item.city === value[0]) {
            this.pickerLoading = true;
            common_vendor.index.request({
              url: `https://www.aomue.cn/dbs/pro/rest/dbs/city/dict/find/tree/${item.id}`,
              method: "GET",
              success: (res) => {
                const colums = [];
                res.data.data.forEach((elements) => {
                  colums.push(elements.city);
                });
                common_vendor.index.setStorageSync("cityData1", res.data.data);
                const specialRegion = ["重庆市", "北京市", "上海市", "天津市"];
                if (specialRegion.includes(value[columnIndex])) {
                  this.pickerTitle = value[columnIndex];
                } else {
                  this.pickerTitle = colums[0];
                }
                picker.setColumnValues(1, colums);
                picker.setColumnValues(2, []);
                this.pickerLoading = false;
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
            this.pickerLoading = true;
            common_vendor.index.request({
              url: `https://www.aomue.cn/dbs/pro/rest/dbs/city/dict/find/tree/${item.id}`,
              method: "GET",
              success: (res) => {
                const colums = [];
                res.data.data.forEach((elements) => {
                  colums.push(elements.city);
                });
                if (colums.length) {
                  picker.setColumnValues(2, colums);
                  this.pickerTitle = colums[0];
                }
                this.pickerLoading = false;
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
      this.handleInputClear();
      this.city = city;
    },
    // 设置城市名称
    setCity() {
      this.city = common_vendor.index.getStorageSync("location").city;
      console.log(this.city);
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
      if (this.columns.length > 0) {
        this.show = true;
      }
    },
    // picker选中
    handleConfirm(info) {
      if (this.pickerTitle) {
        this.city = this.pickerTitle;
        const location = common_vendor.index.getStorageSync("location");
        this.show = false;
        location.city = this.city;
        common_vendor.index.setStorageSync("location", location);
        common_vendor.index.$emit("locationChange", location);
      } else {
        common_vendor.index.showToast({
          title: "未选择城市或者地区",
          duration: 2e3
        });
      }
    },
    /**
    * @description: 关闭
    * @return {*}
    */
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
    d: common_vendor.o($options.handleCancel),
    e: common_vendor.o($options.changeHandler),
    f: common_vendor.p({
      show: $data.show,
      title: $data.pickerTitle,
      columns: $data.columns,
      closeOnClickOverlay: true,
      loading: $data.pickerLoading
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
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d0fa9484"], ["__file", "/Users/heyuanpeng/个人项目/小项目/we-shop-app/compnnents/customNav/customNav.vue"]]);
wx.createComponent(Component);
