import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { DEFAULT_PRIMARY } from "@/config";
import useSettingStore from '@/store/modules/setting';
import { getLightColor, getDarkColor } from "@/utils/color";

/**
 * @description 全局主题 hooks
 * */
export const useTheme = () => {
  const settingStore = useSettingStore();
  const {
    primary,
    isDark,
    isGrey,
    isWeak,
    layout,
    asideInverted,
    headerInverted,
  } = storeToRefs(settingStore);

  // 切换暗黑模式 ==> 同时修改主题颜色、侧边栏、头部颜色
  const switchDark = () => {
    const html = document.documentElement;
    if (isDark.value) html.setAttribute("class", "dark");
    else html.setAttribute("class", "");
    changePrimary(primary.value);
  };

  // 修改主题颜色
  const changePrimary = (val) => {
    if (!val) {
      val = DEFAULT_PRIMARY;
      ElMessage({
        type: "success",
        message: `主题颜色已重置为 ${DEFAULT_PRIMARY}`,
      });
    }
    // 计算主题颜色变化
    document.documentElement.style.setProperty("--el-color-primary", val);
    document.documentElement.style.setProperty("--gmy-theme-color", val);
    document.documentElement.style.setProperty("--el-menu-active-color",val)
    document.documentElement.style.setProperty(
      "--el-color-primary-dark-2",
      isDark.value ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`
    );
    for (let i = 1; i <= 9; i++) {
      const primaryColor = isDark.value
        ? `${getDarkColor(val, i / 10)}`
        : `${getLightColor(val, i / 10)}`;
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        primaryColor
      );
    }
    settingStore.setGlobalState("primary", val);
    settingStore.setRandomKey();

  };

  return {
    switchDark,
    changePrimary,
  };
};
