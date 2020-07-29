<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="V云号">
              <a-input placeholder="请输入V云号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="分润比例">
              <a-input
                style="position:relative"
                placeholder="请输入分润比例"
                v-model="queryParam.rate"
                ref="name"
                class="aaa"
              />
              <span style="position:absolute;width:82px">（单位：%）</span>
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
          <a-popconfirm title="确定本页分润吗?" @confirm="() => allFr()">
            <a-button type="primary">本页分润</a-button>
          </a-popconfirm>
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
        rowKey="rids"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      >
        <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
        <span slot="action" slot-scope="text, record">
          <a @click="handleMembersList(record)">伞下用户列表</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定分润吗?" @confirm="() => shareRate(record)">
            <a>分润</a>
          </a-popconfirm>
        </span>
        <!-- 保留两位小数四舍五入 -->
        <template slot="share" slot-scope="text, record">
          <span slot="share">{{ record.shareProfitMoney | YearFormat }}</span>
        </template>
        <!-- 将小数点转换为百分比 -->
        <template slot="fenRate" slot-scope="text, record">
          <span slot="fenRate">{{ record.rate | toPercentage }}</span>
        </template>
      </a-table>
    </div>
    <!-- 表单区域 -->

    <user-under-list ref="modalForm" @ok="modalFormOk"></user-under-list>
  </a-card>
</template>

<script>
import { postAction } from "@/api/manage";

import { JeecgListMixin } from "@/mixins/JeecgListMixin";

import JEllipsis from "@/components/jeecg/JEllipsis";
import UserUnderList from "./modules/UserUnderList";
export default {
  name: "AppUserUnder",
  mixins: [JeecgListMixin],
  components: {
    UserUnderList,
    JEllipsis
  },

  data() {
    return {
      inviteId: "",
      description: "伞下用户",
      type: "ambassadorList1",

      // queryParam: {
      //   rate: this.total
      // },
      columns: [
        {
          title: "V云号",
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
          title: "伞下用户充值总费用",
          align: "center",
          dataIndex: "totalMoney"
        },
        {
          title: "分润比例",
          align: "center",
          dataIndex: "rate",
          scopedSlots: { customRender: "fenRate" }
        },
        {
          title: "分润所得",
          align: "center",
          dataIndex: "shareProfitMoney",
          scopedSlots: { customRender: "share" }
        },
        {
          title: "伞下人数",
          align: "center",
          dataIndex: "userCount"
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "inviteId",
          width: 180,
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/system/appuserinfo/user-exists-umbrella-list",
        share: "/system/appuserinfo/umbrella-user-share-profit"
      }
    };
  },

  methods: {
    allFr: function() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning("请选择一条记录！");
        return;
      } else {
        var that = this;
        var rids = "";

        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          rids += this.selectedRowKeys[a] + ",";
        }

        var rate = that.$refs.name.value;
        let arr = `?rids=${rids}&rate=${rate}`;

        postAction(that.url.share + arr).then(res => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
            that.onClearSelected();
          } else {
            that.$message.warning(res.message);
          }
        });
      }
    },

    // 单个分润
    shareRate: function(record) {
      var that = this;

      record.rate = that.$refs.name.value;
      let arr = `?rids=${record.rids}&rate=${record.rate}`;

      postAction(that.url.share + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          console.log(res);
          that.loadData();
          that.onClearSelected();
        } else {
          that.$message.warning(res.message);
        }
      });
    },

    handleMembersList(record) {
      console.log(record);
      this.$refs.modalForm.open(record);
    }
  }
};
</script>

<style scoped>
@import "~@assets/less/common.less";
.txt {
  height: 30px;
  width: 150px;
}
</style>
