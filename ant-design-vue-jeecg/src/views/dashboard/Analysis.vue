<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
    <a-col :span="24" align="center">
        <img src="~@assets/logoo.png" alt="V云空间" class="vcloud_logo">
    </a-col>
    </a-row>

    <!-- <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>本周</a>
              <a>本月</a>
              <a>本年</a>
            </div>
            <a-range-picker :style="{width: '256px'}" />
          </div>
          <a-tab-pane loading="true" tab="销售额" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="销售额排行" :dataSource="barData"/>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="访问量" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="销售额趋势" :dataSource="barData"/>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>-->

    <!-- <a-row> -->
    <!-- <a-col :span="24" align="center">
        <img src="~@assets/logoo.png" alt="V云空间" class="vcloud_logo">
    <div class="vcloud_host">V云空间后台管理</div> -->
    <!-- <a-card :loading="loading" :bordered="false" title="最近一周访问次数统计" :style="{ marginTop: '24px' }">
          <a-row>
            <a-col :span="6">
              <head-info title="今日访问IP数" :content="loginfo.todayIp"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="environment" style="font-size: 24px"  />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="今日访问次数" :content="loginfo.todayVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="team" style="font-size: 24px"  />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="访问总次数" :content="loginfo.totalVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="rise" style="font-size: 24px"  />
              </a-spin>-->
            <!-- </a-col>
    </a-row> -->
    <!-- <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid> -->
    <!-- </a-card> -->
    <!-- </a-col> -->
    <!-- </a-row> -->
  </div>
</template>

<script>
import ChartCard from "@/components/ChartCard";
import ACol from "ant-design-vue/es/grid/Col";
import ATooltip from "ant-design-vue/es/tooltip/Tooltip";
import MiniArea from "@/components/chart/MiniArea";
import MiniBar from "@/components/chart/MiniBar";
import MiniProgress from "@/components/chart/MiniProgress";
import RankList from "@/components/chart/RankList";
import Bar from "@/components/chart/Bar";
import LineChartMultid from "@/components/chart/LineChartMultid";
import HeadInfo from "@/components/tools/HeadInfo.vue";
import { getAction } from "@/api/manage";
import Trend from "@/components/Trend";
import { getLoginfo, getVisitInfo } from "@/api/api";
const rankList = [];
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: "白鹭岛 " + (i + 1) + " 号店",
    total: 1234.56 - i * 100
  });
}
const barData = [];
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  });
}
export default {
  name: "Analysis",
  components: {
    ATooltip,
    ACol,
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    LineChartMultid,
    HeadInfo
  },
  data() {
    return {
      loading: true,
      center: null,
      rankList,
      barData,
      loginfo: {},
      visitFields: ["ip", "visit"],
      visitInfo: [],
      indicator: <a-icon type="loading" style="font-size: 24px" spin />,
      cardCount: {},
      url: {
        statistics: "/system/index/statistics-info"
      }
    };
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading;
    }, 1000);
    this.initLogInfo();
    this.queryCount();
  },
  methods: {
    initLogInfo() {
      getLoginfo(null).then(res => {
        if (res.success) {
          Object.keys(res.result).forEach(key => {
            res.result[key] = res.result[key] + "";
          });
          this.loginfo = res.result;
        }
      });
      getVisitInfo().then(res => {
        if (res.success) {
          console.log("aaaaaa", res.result);
          this.visitInfo = res.result;
        }
      });
    },
    queryCount() {
      getAction(this.url.statistics).then(res => {
        if (res.success) {
          this.cardCount = res.result;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.vcloud_logo {
  width: 50%;
  max-width: 650px;
}
.vcloud_host {
  font-size: 28px;
  color: #4a91f2;
}
.circle-cust {
  position: relative;
  top: 28px;
  left: -100%;
}
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    font-size: 0.95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }
  p {
    line-height: 42px;
    margin: 0;
    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}
</style>