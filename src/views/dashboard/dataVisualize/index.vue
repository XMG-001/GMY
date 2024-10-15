<template>
  <div class="dataVisualize-box">
    <div class="card top-box">
      <div class="top-title">数据可视化</div>
      <el-tabs v-model="tabActive" class="demo-tabs">
        <el-tab-pane
          v-for="item in tab"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        ></el-tab-pane>
      </el-tabs>
      <div class="top-content">
        <el-row :gutter="40">
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="item-left sle">
              <span class="left-title">访问总数</span>
              <div class="img-box">
                <img src="./images/book-sum.png" alt="" />
              </div>
              <span class="left-number">848.132w</span>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="18" :xl="18">
            <div class="item-center">
              <div
                v-for="item in trafficData"
                :key="item.id"
                :class="item.className"
              >
                <div class="traffic-img">
                  <img :src="item.imgSrc" alt="" />
                </div>
                <span class="item-value">{{ item.value }}</span>
                <span class="traffic-name sle">{{ item.name }}</span>
              </div>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="item-right">
              <div class="echarts-title">Gitee / GitHub 访问量占比</div>
              <div class="book-echarts">
                <Pie ref="pieRef" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="card bottom-box">
      <div class="bottom-title">数据来源</div>
      <div class="bottom-tabs">
        <el-tabs v-model="tabActive" class="demo-tabs">
          <el-tab-pane
            v-for="item in tab"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="curve-echarts">
        <Curve ref="curveRef" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="dataVisualize">
import { ref } from "vue";
import Pie from "./components/pie.vue";
import Curve from "./components/curve.vue";

const tabActive = ref(1);

const tab = [
  { label: "未来7日", name: 1 },
  { label: "近七日", name: 2 },
  { label: "近一月", name: 3 },
  { label: "近三月", name: 4 },
  { label: "近半年", name: 5 },
  { label: "近一年", name: 6 },
];

const trafficData = [
  {
    id: "gitee",
    imgSrc:'/src/views/dashboard/dataVisualize/images/add_person.png',
    value: 2222,
    name: "Gitee 访问量",
    className: "gitee-traffic traffic-box",
  },
  {
    id: "github",
    imgSrc: "/src/views/dashboard/dataVisualize/images/add_team.png",
    value: 2222,
    name: "GitHub 访问量",
    className: "gitHub-traffic traffic-box",
  },
  {
    id: "today",
    imgSrc: "/src/views/dashboard/dataVisualize/images/today.png",
    value: 4567,
    name: "今日访问量",
    className: "today-traffic traffic-box",
  },
  {
    id: "yesterday",
    imgSrc: "/src/views/dashboard/dataVisualize/images/book_sum.png",
    value: 1234,
    name: "昨日访问量",
    className: "yesterday-traffic traffic-box",
  },
  {
    id: "1",
    imgSrc: "/src/views/dashboard/dataVisualize/images/book_sum.png",
    value: 1234,
    name: "昨日访问量",
    className: "yesterday-traffic traffic-box",
  },
  {
    id: "2",
    imgSrc: "/src/views/dashboard/dataVisualize/images/book_sum.png",
    value: 1234,
    name: "昨日访问量",
    className: "yesterday-traffic traffic-box",
  },
  {
    id: "3",
    imgSrc: "/src/views/dashboard/dataVisualize/images/book_sum.png",
    value: 1234,
    name: "昨日访问量",
    className: "yesterday-traffic traffic-box",
  },
  {
    id: "4",
    imgSrc: "/src/views/dashboard/dataVisualize/images/book_sum.png",
    value: 1234,
    name: "昨日访问量",
    className: "yesterday-traffic traffic-box",
  },
];
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
