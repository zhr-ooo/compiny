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
            <a-form-item label="用户昵称">
              <a-input placeholder="请输入用户昵称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="伞下用户V云号">
              <a-input placeholder="请输入伞下用户V云号" v-model="queryParam.umbrellaCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="伞下用户昵称">
              <a-input placeholder="请输入伞下用户昵称" v-model="queryParam.umbrellaName"></a-input>
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
      >
        <!-- <span slot="action" slot-scope="text, record">
          <a @click="handleMembersList(record)">伞下用户列表</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定分润吗?" @confirm="() => shareRate(record)">
            <a>分润</a>
          </a-popconfirm>
        </span>-->
      </a-table>
    </div>
    <!-- 表单区域 -->

    <user-under-list ref="modalForm" @ok="modalFormOk"></user-under-list>
  </a-card>
</template>

<script>
import { postAction, getAction } from "@/api/manage";

import { JeecgListMixin } from "@/mixins/JeecgListMixin";

import JEllipsis from "@/components/jeecg/JEllipsis";
import UserUnderList from "./modules/UserUnderList";
export default {
  name: "AmbassadorUnder",
  mixins: [JeecgListMixin],
  components: {
    UserUnderList,
    JEllipsis
  },

  data() {
    return {
      description: "大使伞下大使关系",

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
          title: "伞下用户V云号",
          align: "center",
          dataIndex: "umbrellaCode"
        },
        {
          title: "伞下用户昵称",
          align: "center",
          dataIndex: "umbrellaName"
        }

        // {
        //   title: "操作",
        //   align: "center",
        //   dataIndex: "inviteId",
        //   width: 180,
        //   scopedSlots: { customRender: "action" }
        // }
      ],
      url: {
        list: "/system/umbrella/ambassador/list"
      }
    };
  },

  methods: {
    searchQuery() {
      this.loadData(1);
    },
    searchReset() {
      this.queryParam = this.param || {};
      this.loadData(1);
    },
    loadData(arg) {
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams(); //查询条件
      this.loading = true;

      getAction(this.url.list, params).then(res => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;

          console.log(res);
        }
        if (res.code === 510) {
          this.$message.warning(res.message);
        }
        this.loading = false;
      });
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
