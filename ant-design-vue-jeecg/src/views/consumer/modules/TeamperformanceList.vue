<template>
  <a-modal
    title="成员列表"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form layout="inline">
        <a-row :gutter="14">
          <a-col :md="5" :sm="5">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="width: 100%;"
              label="V云号"
            >
              <a-input placeholder="请填写V云号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="width: 100%;"
              label="手机号"
            >
              <a-input placeholder="请填写手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
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
      <div style="margin-top: 24px;">
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="inviteId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange"
        ></a-table>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { filterObj } from "@/utils/util";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";

export default {
  name: "TeamperformanceList",
  mixins: [JeecgListMixin],

  data() {
    return {
      type: "ambassadorList1",
      inviteId: null,
      visible: false,
      confirmLoading: false,
      teamId: null,
      loading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // 表头
      columns: [
        {
          title: "用户v云id",
          align: "center",
          dataIndex: "code"
        },
        {
          title: "用户昵称",
          align: "center",
          dataIndex: "nickName"
        },

        {
          title: "手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "会员充值总费用",
          align: "center",
          dataIndex: "vipTotalMoney"
        },
        {
          title: "服务商充值总费用",
          align: "center",
          dataIndex: "serviceTotalMoney"
        }
      ],
      url: {
        list: "/system/appuserinfo/team-performance-list"
      }
    };
  },
  created() {},
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
      param.inviteId = this.inviteId;
      param.phone = param.phone ? param.phone : "";
      param.code = param.code ? param.code : "";
      return filterObj(param);
    },
    open(record) {
      this.visible = true;
      this.queryParam = {};
      this.inviteId = record.inviteId;
      console.log(record);
      this.ipagination.current = 1;
      this.loadData();
    },
    handleCancel() {
      this.$emit("close");
      this.visible = false;
      this.dataSource = [];
    }
  }
};
</script>

<style scoped>
</style>