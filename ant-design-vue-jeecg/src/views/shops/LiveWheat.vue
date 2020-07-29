<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="类型">
              <a-select placeholder="请选择类型" v-model="queryParam.type">
                <a-select-option :value="1">连麦</a-select-option>
                <a-select-option :value="2">PK</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="主方名称">
              <a-input placeholder="请输入主方名称" v-model="queryParam.mainName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="对方名称">
              <a-input placeholder="请输入对方名称" v-model="queryParam.otherName"></a-input>
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

    <!-- 表格区域 -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="index"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="templateTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="10"></j-ellipsis>
        </span>
        <template slot="createTime" slot-scope="text, record">
          <span slot="createTime">{{ record.createTime | moment }}</span>
        </template>
      </a-table>
    </div>
    <!-- 表单区域 -->

    <!-- <user-under-list ref="modalForm" @ok="modalFormOk"></user-under-list> -->
  </a-card>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { getAction } from "@/api/manage";
export default {
  name: "LiveWheat",
  mixins: [JeecgListMixin],

  data() {
    return {
      description: "直播连麦列表",
      columns: [
        {
          title: "主方名称",
          align: "center",
          dataIndex: "mainName"
        },
        {
          title: "主方币值",
          align: "center",
          dataIndex: "mainMoney"
        },
        {
          title: "对方名称",
          align: "center",
          dataIndex: "otherName"
        },
        {
          title: "对方币值",
          align: "center",
          dataIndex: "otherMoney"
        },
        {
          title: "类型",
          align: "center",
          dataIndex: "type",
          customRender: function(text) {
            if (text == 1) {
              return "连麦";
            } else if (text == 2) {
              return "PK";
            }
          }
        },
        {
          title: "状态",
          align: "center",
          dataIndex: "state",
          customRender: function(text) {
            if (text == 1) {
              return "主方赢";
            } else if (text == 2) {
              return "平局";
            } else if (text == 3) {
              return "对方赢";
            }
          }
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime",
           scopedSlots: { customRender: "createTime" }
        }
      ],
      url: {
        list: "/system/live/connect/mic/list"
      }
    };
  },

  methods: {
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

      getAction(this.url.list, params).then(res => {
        if (res.success) {
          console.log(res);
          this.dataSource = res.result.pageList.records;
          this.ipagination.total = res.result.pageList.total;
          this.total = res.result.pageList.total;
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
