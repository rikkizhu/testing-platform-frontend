<template>
  <div>
    <template>
      <v-tabs :value="3" background-color="primary">
        <v-tab @click="$router.push({ name: 'Case' })">用例管理</v-tab>
        <v-tab @click="$router.push({ name: 'Task' })">任务管理</v-tab>
        <v-tab @click="$router.push({ name: 'Jenkins' })">Jenkins管理</v-tab>
        <v-tab @click="$router.push({ name: 'Report' })">报告管理</v-tab>
        <v-spacer></v-spacer>
        <v-btn text @click="logout()">退出</v-btn>
      </v-tabs>
    </template>

    <template>
      <v-row>
        <v-col cols="6">
          <div id="myChart" style="width: 100%; height: 300px"></div>
        </v-col>
      </v-row>
    </template>

  </div>
</template>

<script>
export default {
  data() {
    return {
      countX: [],
      coutnData: [],
      statusX: [],
      statusData: [],
    };
  },
  created() {
    this.$api.project.getCaseCount().then((res) => {
      var listData = [];
      listData = res.data.data;
      for (let i = 0; i < listData.length; i++) {
        this.countX.push("任务id:" + listData[i].id);
        this.coutnData.push(listData[i].caseCount);
      }
      this.drawChart();
    })
  },
  methods: {
    logout() {
      this.$api.user.logOut().then((res) => {
        console.log(res);
        this.$router.push("/");
      });
    },
    drawChart() {
      var myEcharts = require("echarts");
      var myChart = myEcharts.init(document.getElementById("myChart"));
      myChart.setOption({
        title: {
          text: "测试任务用例数量统计",
        },
        xAxis: {
          type: "category",
          data: this.countX,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.coutnData,
            type: "line",
          },
        ],
      });
    }
  },
};
</script>

<style scoped>
</style>