<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="26">
          <a-col :md="5" :sm="5">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="5">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="6">
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
      ></a-table>
    </div>
  </a-card>
</template>

<script>
import { postAction } from "@/api/manage";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
export default {
  name: "LeagueRecharge",
  mixins: [JeecgListMixin],
  data() {
    return {
      description: "V联盟充值",
      type: "ambassadorList1",
      phone:"",
      name:"",
      columns: [
        {
          title: "姓名",
          align: "center",
          dataIndex: "name"
        },
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "微信号",
          align: "center",
          dataIndex: "wechatId"
        },
        {
          title: "支付金额",
          align: "center",
          dataIndex: "money"
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime"
        },

        {
          title: "订单编号",
          align: "center",
          dataIndex: "orderNumber"
        },
        {
          title: "商品编号",
          align: "center",
          dataIndex: "tradeNumber"
        },
        {
          title: "收货地址",
          align: "center",
          dataIndex: "address"
        }
      ],
      url: {
        list: "/system/appuserinfo/alliance-recharge-list"
      }
    };
  },
};
</script>

<style>
</style>
