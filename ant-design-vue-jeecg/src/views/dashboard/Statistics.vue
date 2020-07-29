<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <router-link to="/consumer/officiallist">
          <chart-card
            :loading="loading"
            title="赠送VIP数量"
            :total="cardCount.givingVipCount | NumberFormat"
          >
            <!-- <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
            </a-tooltip>-->
            <!-- <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
            </div>-->
            <!-- <template slot="footer">
            日均销售额
            <span>￥ 234.56</span>
            </template>-->
          </chart-card>
        </router-link>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <router-link to="/consumer/AppUserInfolist">
          <chart-card
            :loading="loading"
            title="付费Vip数量"
            :total="cardCount.payVipCount | NumberFormat"
          >
            <!-- <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
            </a-tooltip>-->
            <!-- <div>
            <mini-area />
            </div>-->
            <!-- <template slot="footer">
            日访问量
            <span>{{ '1234' | NumberFormat }}</span>
            </template>-->
          </chart-card>
        </router-link>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
      <router-link to="/consumer/appusermoneydetaillist">
      <!-- <router-link :to="{path:'/consumer/appusermoneydetaillist',query:{type: '充值V币', age: 18}}"> -->
          <chart-card
            :loading="loading"
            title="充值V币总金额"
            :total="cardCount.rechangeVCoinMoney | NumberFormat"
          >
            <!-- <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
            </a-tooltip>-->
            <!-- <div>
            <mini-bar :height="40" />
          </div>
          <template slot="footer">
            转化率
            <span>60%</span>
            </template>-->
          </chart-card>
        </router-link>
      </a-col>
       <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
      <router-link to="/consumer/appusermoneydetaillist">
      <!-- <router-link :to="{path:'/consumer/appusermoneydetaillist',query:{type: '充值V币', age: 18}}"> -->
          <chart-card
            :loading="loading"
            title="正式充值V币总金额"
            :total="cardCount.formalRechangeVCoinMoney | NumberFormat"
          >
            <!-- <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
            </a-tooltip>-->
            <!-- <div>
            <mini-bar :height="40" />
          </div>
          <template slot="footer">
            转化率
            <span>60%</span>
            </template>-->
          </chart-card>
        </router-link>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <router-link to="/consumer/AppUserInfolist">
          <chart-card
            :loading="loading"
            title="用户剩余V钻"
            :total="cardCount.surplusVDiamondMoney | NumberFormat"
          >
            <!-- <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
            </a-tooltip>-->
            <!-- <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" :height="8" />
            </div>-->
            <!-- <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>-->
            <!-- </template> -->
          </chart-card>
        </router-link>
      </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <router-link to="/consumer/AppUserInfolist">
          <chart-card
            :loading="loading"
            title="正式用户剩余V钻"
            :total="cardCount.formalSurplusVDiamondMoney | NumberFormat"
          >
            <!-- <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
            </a-tooltip>-->
            <!-- <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" :height="8" />
            </div>-->
            <!-- <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>-->
            <!-- </template> -->
          </chart-card>
        </router-link>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <router-link to="/platform/withdrawlist">
          <chart-card
            :loading="loading"
            title="用户提现中总金额"
            :total="cardCount.withdrawMoney | NumberFormat"
          ></chart-card>
        </router-link>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <router-link to="/platform/withdrawlist">
          <chart-card
            :loading="loading"
            title="用户提现中V钻总金额"
            :total="cardCount.withdrawVDiamondMoney | NumberFormat"
          ></chart-card>
        </router-link>
      </a-col>
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <router-link to="/consumer/AppUserInfolist">
          <chart-card
            :loading="loading"
            title="用户剩余V币"
            :total="cardCount.surplusMoney | NumberFormat"
          >
          </chart-card>
        </router-link>
      </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <router-link to="/consumer/AppUserInfolist">
          <chart-card
            :loading="loading"
            title="正式用户剩余V币"
            :total="cardCount.formalSurplusMoney | NumberFormat"
          >
          </chart-card>
        </router-link>
      </a-col>
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
            <!-- <router-link :to="{path:'/consumer/appusermoneydetaillist',query:{type: '充值V币', age: 18}}"> -->
        <router-link to="/consumer/vstatrstvong">
          <chart-card
            :loading="loading"
            title="全部用户V值"
            :total="cardCount.allVMoney | NumberFormat"
          >
          </chart-card>
        </router-link>
      </a-col>
          <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
            <!-- marker -->
        <router-link :to="{path:'/consumer/vstatrstvong',query:{marker:1}}">
        <!-- <router-link :to="'/consumer/vstatrstvong?marker=1'"> -->
          <chart-card
            :loading="loading"
            title="正式用户V值"
            :total="cardCount.formalVMoney | NumberFormat"
          >
          </chart-card>
        </router-link>
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
  name: "Statistics",
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


/* 首页访问量统计 */


</style>