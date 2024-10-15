<template>
  <div id="echarts" ref="chartRef" :style="echartsStyle" />
</template>

<script setup lang="ts" name="ECharts">
// 导入必要的Vue和ECharts相关的模块和函数
import { ref, onMounted, onBeforeUnmount, watch, computed, markRaw, nextTick, onActivated } from "vue";
import { EChartsType, ECElementEvent } from "echarts/core";
import echarts, { ECOption } from "./config";
import { useDebounceFn } from "@vueuse/core";
import useSettingStore from "@/store/modules/setting";
import { storeToRefs } from "pinia";

// 定义组件的props接口
interface Props {
  option: ECOption;
  renderer?: "canvas" | "svg";
  resize?: boolean;
  theme?: Object | string;
  width?: number | string;
  height?: number | string;
  onClick?: (event: ECElementEvent) => any;
}

// 设置props的默认值
const props = withDefaults(defineProps<Props>(), {
  renderer: "canvas",
  resize: true
});

// 计算echarts容器的样式
const echartsStyle = computed(() => {
  return props.width || props.height
    ? { height: props.height + "px", width: props.width + "px" }
    : { height: "100%", width: "100%" };
});

// 定义对echarts容器DOM元素的引用
const chartRef = ref<HTMLDivElement | HTMLCanvasElement>();
// 定义对echarts实例的引用
const chartInstance = ref<EChartsType>();

// 定义绘制图表的函数
/**
 * 绘制图表
 */
const draw = () => {
  if (chartInstance.value) {
    chartInstance.value.setOption(props.option, { notMerge: true });
  }
};

// 监听props的变化，变化时重新绘制图表
watch(props, () => {
  draw();
});

// 定义点击事件的处理函数
/**
 * 处理图表点击事件
 * @param event - ECharts元素事件
 */
const handleClick = (event: ECElementEvent) => props.onClick && props.onClick(event);

// 初始化echarts实例
/**
 * 初始化echarts实例
 */
const init = () => {
  if (!chartRef.value) return;
  chartInstance.value = echarts.getInstanceByDom(chartRef.value);

  if (!chartInstance.value) {
    chartInstance.value = markRaw(
      echarts.init(chartRef.value, props.theme, {
        renderer: props.renderer
      })
    );
    chartInstance.value.on("click", handleClick);
    draw();
  }
};

// 定义调整图表大小的函数
/**
 * 调整图表大小
 */
const resize = () => {
  if (chartInstance.value && props.resize) {
    chartInstance.value.resize({ animation: { duration: 300 } });
  }
};

// 使用防抖函数来优化resize事件的触发频率
const debouncedResize = useDebounceFn(resize, 300, { maxWait: 800 });

// 获取全局状态管理中的相关状态
const settingStore = useSettingStore();
const { maximize, isCollapse, tabs, footer } = storeToRefs(settingStore);

// 监听全局状态的变化，变化时调整图表大小
watch(
  () => [maximize, isCollapse, tabs, footer],
  () => {
    debouncedResize();
  },
  { deep: true }
);

// 组件挂载后初始化echarts实例，并添加窗口resize事件监听
onMounted(() => {
  nextTick(() => init());
  window.addEventListener("resize", debouncedResize);
});

// 组件激活时调整图表大小
onActivated(() => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
});

// 组件卸载前清理资源
onBeforeUnmount(() => {
  chartInstance.value?.dispose();
  window.removeEventListener("resize", debouncedResize);
});

// 暴露一些方法供外部调用
defineExpose({
  getInstance: () => chartInstance.value,
  resize,
  draw
});
</script>
