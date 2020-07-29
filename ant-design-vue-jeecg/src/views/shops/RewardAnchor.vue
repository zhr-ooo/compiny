<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="订单编号">
              <a-input placeholder="请输入订单编号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="礼物名称">
              <a-input placeholder="请输入礼物名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="用户名称">
              <a-input placeholder="请输入用户名称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="房间号">
              <a-input placeholder="请输入房间号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="创建时间">
              <a-range-picker
                v-model="queryParam.createTimeRange"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="用户标识">
              <a-select placeholder="请选择用户标识" v-model="queryParam.marker">
                <a-select-option value="0">测试</a-select-option>
                <a-select-option value="1">正式</a-select-option>
                <a-select-option value="2">官方</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="3">
            <span
              style="float: left;overflow: hidden;margin-left:8px"
              class="table-page-search-submitButtons"
            >
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
        <a-row style="height:120px">
          <a-col :sm="6" :md="6" :xl="6" :style="{ height:'50px',border:'1px solid gary' }">
            <chart-card
              :bordered="true"
              :loading="loading"
              title="用户打赏主播礼物数量"
              :total="this.giftOrderCount.toString()"
            ></chart-card>
          </a-col>
          <a-col :sm="6" :md="6" :xl="6" :style="{ height:'50px',border:'1px solid gary' }">
            <chart-card
              :loading="loading"
              title="用户打赏主播礼物V币"
              :total="this.giftOrderVCoinMoney.toString()"
            ></chart-card>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--  分润 -->
    <!-- 表格区域 -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="header" slot-scope="text">
          <a-avatar
            shape="square"
            size="large"
            :src="text"
            :srcSet="text"
            @click.stop="bigImg(text)"
          ></a-avatar>
        </span>
        <span slot="templateTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="10"></j-ellipsis>
        </span>
        <template slot="createTime" slot-scope="text, record">
          <span slot="createTime">{{ record.createTime | moment }}</span>
        </template>
      </a-table>
    </div>
    <!-- 表单区域 -->
    <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
import moment from "moment";
import { postAction, getAction } from "@/api/manage";
import { filterObj, formatDate } from "@/utils/util";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import ChartCard from "@/components/ChartCard";
import JEllipsis from "@/components/jeecg/JEllipsis";
export default {
  name: "RewardAnchor",
  mixins: [JeecgListMixin],
  components: {
    ProductNewBigImg,
    JEllipsis,
    ChartCard,
  },

  data() {
    return {
      description: "用户打赏主播礼物列表",
      dataSource: [],
      giftOrderCount: 0,
      giftOrderVCoinMoney: 0,
      queryParam: {
        createTimeRange: [],
        logType: "0",
        beginTime: "",
        endTime: "",
        operType: "",
      },
      param: {
        createTimeRange: [],
        logType: "0",
        beginTime: "",
        endTime: "",
        operType: "",
      },
      columns: [
        {
          title: "订单编号",
          align: "center",
          dataIndex: "orderNo",
        },
        {
          title: "用户名称",
          align: "center",
          dataIndex: "nickName",
        },
        {
          title: "房间号",
          align: "center",
          dataIndex: "code",
        },
        {
          title: "主播获得V钻",
          align: "center",
          dataIndex: "balance",
        },
        {
          title: "礼物图标",
          align: "center",
          dataIndex: "icon",
          scopedSlots: { customRender: "header" },
        },
        {
          title: "打赏礼物单价V币",
          align: "center",
          dataIndex: "money",
        },
        {
          title: "礼物名称",
          align: "center",
          dataIndex: "name",
        },
        {
          title: "打赏礼物数量",
          align: "center",
          dataIndex: "number",
        },
        {
          title: "直播用户昵称",
          align: "center",
          dataIndex: "liveNickName",
        },
        {
          title: "用户标识",
          align: "center",
          dataIndex: "marker",
          customRender: function (text) {
            if (text == 0) {
              return "测试";
            } else if (text == 1) {
              return "正式";
            } else if (text == 2) {
              return "官方";
            }
          },
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime",
          scopedSlots: { customRender: "createTime" },
        },
      ],
      url: {
        list: "/system/live/gitOrder/list",
      },
    };
  },

  methods: {
    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error("请设置url.list属性!");
        return;
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams(); //查询条件
      this.loading = true;

      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          console.log(res);
          this.dataSource = res.result.listVoIPage.records;
          this.ipagination.total = res.result.listVoIPage.total;
          this.total = res.result.listVoIPage.total;
          this.giftOrderCount = res.result.giftOrderCount;
          this.giftOrderVCoinMoney = res.result.giftOrderVCoinMoney;
        }
        if (res.code === 510) {
          this.$message.warning(res.message);
        }
        this.loading = false;
      });
    },
    handleMembersList(record) {
      this.$refs.modalForm.open(record);
    },
    getQueryParams() {
      console.log(this.queryParam.createTimeRange);
      var param = Object.assign({}, this.queryParam, this.isorter);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      param.createTimeRange = this.createTimeRange;
      param.beginTime = this.queryParam.beginTime;
      param.endTime = this.queryParam.endTime;
      return filterObj(param);
    },
    onDateChange: function (value, dateString) {
      console.log(dateString[0], dateString[1]);
      this.queryParam.beginTime = dateString[0] + " 00:00:00";
      this.queryParam.endTime = dateString[1] + " 00:00:00";
    },
    onDateOk(value) {
      console.log(value);
    },
  },
};
</script>

<style scoped>
@import "~@assets/less/common.less";
.txt {
  height: 30px;
  width: 150px;
}
</style>
