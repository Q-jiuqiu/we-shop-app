"use strict";
const uni_modules_uviewPlus_libs_config_props = require("../../libs/config/props.js");
const props = {
  props: {
    // 是否展示工具条
    show: {
      type: Boolean,
      default: uni_modules_uviewPlus_libs_config_props.defprops.toolbar.show
    },
    // 取消按钮的文字
    cancelText: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.toolbar.cancelText
    },
    // 确认按钮的文字
    confirmText: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.toolbar.confirmText
    },
    // 取消按钮的颜色
    cancelColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.toolbar.cancelColor
    },
    // 确认按钮的颜色
    confirmColor: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.toolbar.confirmColor
    },
    // 标题文字
    title: {
      type: String,
      default: uni_modules_uviewPlus_libs_config_props.defprops.toolbar.title
    }
  }
};
exports.props = props;
