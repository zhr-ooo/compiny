<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="5" :sm="8">
            <a-form-item label="用户昵称">
              <a-input placeholder="请输入用户昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="房间号">
              <a-input placeholder="请输入房间号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="提现状态">
              <a-select placeholder="请选择提现状态" v-model="queryParam.status">
                <a-select-option :value="1">申请中</a-select-option>
                <a-select-option :value="2">申请成功</a-select-option>
                <a-select-option :value="3">申请失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
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

    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>-->

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
        <span slot="templateAddress" slot-scope="text">
          <j-ellipsis :value="text" :length="8"></j-ellipsis>
        </span>

        <span slot="action" slot-scope="text, record" v-show="record.status === 1">
          <a-popconfirm title="确定同意此申请吗?" @confirm="() => handleOk(record.id)">
            <a>同意</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-popconfirm title="确定拒绝此申请吗?" @confirm="() => handleRefused(record.id)">
            <a>拒绝</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <withdraw-modal ref="modalForm" @ok="modalFormOk"></withdraw-modal>
    <withdraw-audit-modal ref="modalAudit" @ok="modalFormOk"></withdraw-audit-modal>
  </a-card>
</template>

<script>
import { getAction } from "@/api/manage";
import WithdrawModal from "./modules/WithdrawModal";
import WithdrawAuditModal from "./modules/WithdrawAuditModal";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { formatDate } from "@/utils/util";
import JEllipsis from "@/components/jeecg/JEllipsis";

export default {
  name: "WithdrawList",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    WithdrawModal,
    WithdrawAuditModal,
  },
  data() {
    return {
      description: "提现记录表管理页面",
      queryParam: {
        status: "",
      },
      param: {
        status: "",
      },
      // 表头
      columns: [
        {
          title: "用户昵称",
          align: "center",
          dataIndex: "nickName",
        },
        {
          title: "提现金额",
          align: "center",
          dataIndex: "money",
          customRender: function (text) {
            return text + "元";
          },
        },
        {
          title: "提现的独家钻",
          align: "center",
          dataIndex: "diamond",
          customRender: function (text) {
            return text + "个";
          },
        },
        {
          title: "房间号",
          align: "center",
          dataIndex: "code",
        },
        {
          title: "提现时间",
          align: "center",
          dataIndex: "createTime",
          customRender: function (text) {
            return formatDate(text, "yyyy-MM-dd");
          },
        },
        {
          title: "状态",
          align: "center",
          dataIndex: "status",
          customRender: function (text) {
            if (text === 1) {
              return "申请中";
            } else if (text === 2) {
              return "申请成功";
            } else if (text === 3) {
              return "申请失败";
            }
          },
        },
        {
          title: "资金流向",
          align: "center",
          dataIndex: "type",
          customRender: function (text) {
            if (text === 1) {
              return "微信";
            } else if (text === 2) {
              return "银行卡";
            } else {
              return " ";
            }
          },
        },
        {
          title: "申请提现理由",
          align: "center",
          dataIndex: "reason",
          scopedSlots: { customRender: "templateAddress" },
        },
        {
          title: "失败原因",
          align: "center",
          dataIndex: "failReason",
          scopedSlots: { customRender: "templateAddress" },
        },
        {
          title: "申请通过时间",
          align: "center",
          dataIndex: "successTime",
          customRender: function (text) {
            if (text) {
              return formatDate(text, "yyyy-MM-dd");
            } else {
              return " ";
            }
          },
        },
        {
          title: "申请失败时间",
          align: "center",
          dataIndex: "failTime",
          customRender: function (text) {
            if (text) {
              return formatDate(text, "yyyy-MM-dd");
            } else {
              return " ";
            }
          },
        },
        {
          title: "银行卡信息",
          align: "center",
          dataIndex: "userBankId",
        },
        {
          title: "阿里账号",
          align: "center",
          dataIndex: "aliId",
        },
        {
          title: "阿里名字",
          align: "center",
          dataIndex: "aliName",
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      url: {
        list: "/system/withdraw/list",
        auditTrue: "/system/withdraw/auditTrue",
      },
    };
  },
  methods: {
    handleOk(id) {
      getAction(this.url.auditTrue, { id: id })
        .then((res) => {
          if (res.success) {
            this.$message.success(res.message);
            this.loadData();
          } else {
            this.$message.success(res.message);
          }
        })
        .catch((err) => {
          this.$message.success(err.message);
        });
    },
    handleRefused(id) {
      this.$refs.modalAudit.open(id);
    },
       searchReset() {
      this.queryParam =  {}
      this.loadData(1);
    },
  },
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>