<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="5" :sm="5">
            <a-form-item label="昵称/手机号/V云号：">
              <a-input placeholder="请输入昵称/手机号/V云号" v-model="queryParam.search"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="支出/收益">
              <a-select placeholder="请选择" v-model="queryParam.detailType">
                <a-select-option value="支出">支出</a-select-option>
                <a-select-option value="收益">收益</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="类型">
              <a-select placeholder="请输入类型" v-model="queryParam.type">
                <a-select-option
                  v-for="item in typeList"
                  :key="item.type"
                  :value="item.type"
                >{{ item.info }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="支付方式">
              <a-select placeholder="请选择支付方式" v-model="queryParam.payType">
                <a-select-option :value="1">微信</a-select-option>
                <a-select-option :value="4">支付宝</a-select-option>
                <a-select-option :value="2">独家币</a-select-option>
                <a-select-option :value="3">独家钻</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
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
      </a-form>
    </div>
    <!-- table区域-begin -->
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
        <template slot="createTime" slot-scope="text, record">
          <span slot="createTime">{{ record.createTime | moment }}</span>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->
    
  </a-card>
</template>

<script>
import { getAction } from "@/api/manage";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { filterObj } from "@/utils/util";

export default {
  name: "AppUserMoneyDetailList",
  mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      description: "消费流水记录管理页面",
      typeList: [],
      type: this.$route.query.type,
      // 表头
      columns: [
        {
          title: "用户昵称",
          align: "center",
          dataIndex: "nickName"
        },
        {
          title: "类型",
          align: "center",
          dataIndex: "type"
        },
        {
          title: "支出/收益",
          align: "center",
          dataIndex: "detailType"
        },
        {
          title: "金额",
          align: "center",
          dataIndex: "money"
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime",
          scopedSlots: { customRender: "createTime" }
        },
        {
          title: "支付方式",
          align: "center",
          dataIndex: "payType",
          customRender: function(text, record) {
            if (record.info === "充值会员" || record.info === "充值V币") {
              if (text === 1) {
                return "支付宝";
              } else if (text === 2) {
                return "微信";
              } else {
                return text;
              }
            } else {
              if (text === 1) {
                return "微信";
              } else if (text === 2) {
                return "独家币";
              } else if (text === 3) {
                return "独家钻";
              }
            }
          }
        },
        // {
        //   title: '交易码',
        //   align:"center",
        //   dataIndex: 'payCode'
        //  },
        {
          title: "订单编号",
          align: "center",
          dataIndex: "code"
        },
        // {
        //   title: '微信Code',
        //   align:"center",
        //   dataIndex: 'wxCode'
        //  },
        {
          title: "打赏用户（主播打赏以及进入付费直播时有该用户）/分销的用户",
          align: "center",
          dataIndex: "fromUserId"
        },
        {
          title: "充值独家币实际支付金额",
          align: "center",
          dataIndex: "trueMoney"
        }
      ],
      url: {
        selectlist: "/system/appusermoneydetail/findTypeSelect",
        list: "/system/appusermoneydetail/pageList",
        delete: "/user/appUserMoneyDetail/delete"
      }
    };
  },
  created() {
    getAction(this.url.selectlist)
      .then(res => {
        if (res.success) {
          this.typeList = res.result;
        } else {
          this.$message.warning(res.message);
        }
      })
      .catch(err => {
        this.$message.warning(err.message);
      });
  },
  methods: {

    getQueryParams() {
      //获取查询条件
      let sqp = {};
      if (this.superQueryParams) {
        sqp["superQueryParams"] = encodeURI(this.superQueryParams);
      }
      var param = Object.assign(
        sqp,
        this.queryParam,
        this.isorter,
        this.filters
      );
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      param.detailType = param.detailType ? param.detailType : "";
      param.search = param.search ? param.search : "";
      param.type = param.type ? param.type : "";
      param.payType = param.payType ? param.payType : "";
      return filterObj(param);
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
