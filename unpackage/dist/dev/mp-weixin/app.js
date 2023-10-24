"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_uviewPlus_index = require("./uni_modules/uview-plus/index.js");
require("./uni_modules/uview-plus/libs/mixin/mixin.js");
require("./uni_modules/uview-plus/libs/mixin/mpMixin.js");
require("./uni_modules/uview-plus/libs/luch-request/core/Request.js");
require("./uni_modules/uview-plus/libs/luch-request/core/dispatchRequest.js");
require("./uni_modules/uview-plus/libs/luch-request/adapters/index.js");
require("./uni_modules/uview-plus/libs/luch-request/helpers/buildURL.js");
require("./uni_modules/uview-plus/libs/luch-request/utils.js");
require("./uni_modules/uview-plus/libs/luch-request/core/buildFullPath.js");
require("./uni_modules/uview-plus/libs/luch-request/helpers/isAbsoluteURL.js");
require("./uni_modules/uview-plus/libs/luch-request/helpers/combineURLs.js");
require("./uni_modules/uview-plus/libs/luch-request/core/settle.js");
require("./uni_modules/uview-plus/libs/luch-request/core/InterceptorManager.js");
require("./uni_modules/uview-plus/libs/luch-request/core/mergeConfig.js");
require("./uni_modules/uview-plus/libs/luch-request/core/defaults.js");
require("./uni_modules/uview-plus/libs/luch-request/utils/clone.js");
require("./uni_modules/uview-plus/libs/util/route.js");
require("./uni_modules/uview-plus/libs/function/colorGradient.js");
require("./uni_modules/uview-plus/libs/function/test.js");
require("./uni_modules/uview-plus/libs/function/debounce.js");
require("./uni_modules/uview-plus/libs/function/throttle.js");
require("./uni_modules/uview-plus/libs/function/index.js");
require("./uni_modules/uview-plus/libs/function/digit.js");
require("./uni_modules/uview-plus/libs/config/config.js");
require("./uni_modules/uview-plus/libs/config/props.js");
require("./uni_modules/uview-plus/libs/config/props/actionSheet.js");
require("./uni_modules/uview-plus/libs/config/props/album.js");
require("./uni_modules/uview-plus/libs/config/props/alert.js");
require("./uni_modules/uview-plus/libs/config/props/avatar.js");
require("./uni_modules/uview-plus/libs/config/props/avatarGroup.js");
require("./uni_modules/uview-plus/libs/config/props/backtop.js");
require("./uni_modules/uview-plus/libs/config/props/badge.js");
require("./uni_modules/uview-plus/libs/config/props/button.js");
require("./uni_modules/uview-plus/libs/config/props/calendar.js");
require("./uni_modules/uview-plus/libs/config/props/carKeyboard.js");
require("./uni_modules/uview-plus/libs/config/props/cell.js");
require("./uni_modules/uview-plus/libs/config/props/cellGroup.js");
require("./uni_modules/uview-plus/libs/config/props/checkbox.js");
require("./uni_modules/uview-plus/libs/config/props/checkboxGroup.js");
require("./uni_modules/uview-plus/libs/config/props/circleProgress.js");
require("./uni_modules/uview-plus/libs/config/props/code.js");
require("./uni_modules/uview-plus/libs/config/props/codeInput.js");
require("./uni_modules/uview-plus/libs/config/props/col.js");
require("./uni_modules/uview-plus/libs/config/props/collapse.js");
require("./uni_modules/uview-plus/libs/config/props/collapseItem.js");
require("./uni_modules/uview-plus/libs/config/props/columnNotice.js");
require("./uni_modules/uview-plus/libs/config/props/countDown.js");
require("./uni_modules/uview-plus/libs/config/props/countTo.js");
require("./uni_modules/uview-plus/libs/config/props/datetimePicker.js");
require("./uni_modules/uview-plus/libs/config/props/divider.js");
require("./uni_modules/uview-plus/libs/config/props/empty.js");
require("./uni_modules/uview-plus/libs/config/props/form.js");
require("./uni_modules/uview-plus/libs/config/props/formItem.js");
require("./uni_modules/uview-plus/libs/config/props/gap.js");
require("./uni_modules/uview-plus/libs/config/props/grid.js");
require("./uni_modules/uview-plus/libs/config/props/gridItem.js");
require("./uni_modules/uview-plus/libs/config/props/icon.js");
require("./uni_modules/uview-plus/libs/config/props/image.js");
require("./uni_modules/uview-plus/libs/config/props/indexAnchor.js");
require("./uni_modules/uview-plus/libs/config/props/indexList.js");
require("./uni_modules/uview-plus/libs/config/props/input.js");
require("./uni_modules/uview-plus/libs/config/props/keyboard.js");
require("./uni_modules/uview-plus/libs/config/props/line.js");
require("./uni_modules/uview-plus/libs/config/props/lineProgress.js");
require("./uni_modules/uview-plus/libs/config/props/link.js");
require("./uni_modules/uview-plus/libs/config/props/list.js");
require("./uni_modules/uview-plus/libs/config/props/listItem.js");
require("./uni_modules/uview-plus/libs/config/props/loadingIcon.js");
require("./uni_modules/uview-plus/libs/config/props/loadingPage.js");
require("./uni_modules/uview-plus/libs/config/props/loadmore.js");
require("./uni_modules/uview-plus/libs/config/props/modal.js");
require("./uni_modules/uview-plus/libs/config/props/navbar.js");
require("./uni_modules/uview-plus/libs/config/color.js");
require("./uni_modules/uview-plus/libs/config/props/noNetwork.js");
require("./uni_modules/uview-plus/libs/config/props/noticeBar.js");
require("./uni_modules/uview-plus/libs/config/props/notify.js");
require("./uni_modules/uview-plus/libs/config/props/numberBox.js");
require("./uni_modules/uview-plus/libs/config/props/numberKeyboard.js");
require("./uni_modules/uview-plus/libs/config/props/overlay.js");
require("./uni_modules/uview-plus/libs/config/props/parse.js");
require("./uni_modules/uview-plus/libs/config/props/picker.js");
require("./uni_modules/uview-plus/libs/config/props/popup.js");
require("./uni_modules/uview-plus/libs/config/props/radio.js");
require("./uni_modules/uview-plus/libs/config/props/radioGroup.js");
require("./uni_modules/uview-plus/libs/config/props/rate.js");
require("./uni_modules/uview-plus/libs/config/props/readMore.js");
require("./uni_modules/uview-plus/libs/config/props/row.js");
require("./uni_modules/uview-plus/libs/config/props/rowNotice.js");
require("./uni_modules/uview-plus/libs/config/props/scrollList.js");
require("./uni_modules/uview-plus/libs/config/props/search.js");
require("./uni_modules/uview-plus/libs/config/props/section.js");
require("./uni_modules/uview-plus/libs/config/props/skeleton.js");
require("./uni_modules/uview-plus/libs/config/props/slider.js");
require("./uni_modules/uview-plus/libs/config/props/statusBar.js");
require("./uni_modules/uview-plus/libs/config/props/steps.js");
require("./uni_modules/uview-plus/libs/config/props/stepsItem.js");
require("./uni_modules/uview-plus/libs/config/props/sticky.js");
require("./uni_modules/uview-plus/libs/config/props/subsection.js");
require("./uni_modules/uview-plus/libs/config/props/swipeAction.js");
require("./uni_modules/uview-plus/libs/config/props/swipeActionItem.js");
require("./uni_modules/uview-plus/libs/config/props/swiper.js");
require("./uni_modules/uview-plus/libs/config/props/swipterIndicator.js");
require("./uni_modules/uview-plus/libs/config/props/switch.js");
require("./uni_modules/uview-plus/libs/config/props/tabbar.js");
require("./uni_modules/uview-plus/libs/config/props/tabbarItem.js");
require("./uni_modules/uview-plus/libs/config/props/tabs.js");
require("./uni_modules/uview-plus/libs/config/props/tag.js");
require("./uni_modules/uview-plus/libs/config/props/text.js");
require("./uni_modules/uview-plus/libs/config/props/textarea.js");
require("./uni_modules/uview-plus/libs/config/props/toast.js");
require("./uni_modules/uview-plus/libs/config/props/toolbar.js");
require("./uni_modules/uview-plus/libs/config/props/tooltip.js");
require("./uni_modules/uview-plus/libs/config/props/transition.js");
require("./uni_modules/uview-plus/libs/config/props/upload.js");
require("./uni_modules/uview-plus/libs/config/zIndex.js");
require("./uni_modules/uview-plus/libs/function/platform.js");
if (!Math) {
  "./pages/foods/foods.js";
  "./pages/sense/sense.js";
  "./pages/message/message.js";
  "./pages/detail/detail.js";
  "./pages/index/index.js";
  "./pages/avoidBad/avoidBad.js";
  "./pages/map/map.js";
  "./pages/cityInfo/cityInfo.js";
}
const _sfc_main = {
  onShow: function() {
    common_vendor.index.getSystemInfo({
      success: (result) => {
        let statusBarHeight = result.statusBarHeight + "px";
        let safeAreaBottom = result.safeArea.bottom + "px";
        const menuButtonInfo = common_vendor.index.getMenuButtonBoundingClientRect();
        let menuWidth = menuButtonInfo.width + "px";
        let menuHeight = menuButtonInfo.height + "px";
        let menuBorderRadius = menuButtonInfo.height / 2 + "px";
        let menuRight = result.screenWidth - menuButtonInfo.right + "px";
        let menuTop = menuButtonInfo.top + "px";
        let contentTop = result.statusBarHeight + 44 + "px";
        let surplusWidth = menuButtonInfo.left + "px";
        let menuInfo = {
          statusBarHeight,
          //状态栏高度----用来给自定义导航条页面的顶部导航条设计padding-top使用：目的留出系统的状态栏区域
          menuWidth,
          //右侧的胶囊宽度--用来给自定义导航条页面的左侧胶囊设置使用
          menuHeight,
          //右侧的胶囊高度--用来给自定义导航条页面的左侧胶囊设置使用
          menuBorderRadius,
          //一半的圆角--用来给自定义导航条页面的左侧胶囊设置使用
          menuRight,
          //右侧的胶囊距离右侧屏幕距离--用来给自定义导航条页面的左侧胶囊设置使用
          menuTop,
          //右侧的胶囊顶部距离屏幕顶部的距离--用来给自定义导航条页面的左侧胶囊设置使用
          contentTop,
          //内容区距离页面最上方的高度--用来给自定义导航条页面的内容区定位距离使用
          surplusWidth,
          // 剩余宽度
          safeAreaBottom,
          model: result.model,
          screenHeight: result.screenHeight,
          // 屏幕高度
          windowHeight: result.windowHeight,
          // 窗口高度
          pixelRatio: result.pixelRatio
          // 设备像素比
        };
        common_vendor.index.setStorageSync("menuInfo", menuInfo);
      },
      fail: (error) => {
        console.log(error);
      }
    });
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/heyuanpeng/个人项目/小项目/we-shop-app/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(uni_modules_uviewPlus_index.uviewPlus);
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
