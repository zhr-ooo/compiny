<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="角色">
              <a-select placeholder="请选择角色" v-model="queryParam.role">
                <a-select-option :value="1">VIP</a-select-option>
                <a-select-option :value="2">创客达人</a-select-option>
                <a-select-option :value="3">大使服务商</a-select-option>
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
      </a-form>
    </div>
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a style="color: red">删除</a>
          </a-popconfirm>
        </span>
        <template slot="rebate" slot-scope="text, record">
          <span slot="rebate">{{ record.vipRatio}}%</span>
        </template>
        <template slot="rebate1" slot-scope="text, record">
          <span slot="rebate1">{{ record.creatorRatio}}%</span>
        </template>
        <template slot="rebate2" slot-scope="text, record">
          <span slot="rebate2">{{ record.ambassadorRatio}}%</span>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <Provider-modals ref="modalForm" @ok="modalFormOk"></Provider-modals>
  </a-card>
</template>

<script>
import ProviderModals from "./modules/ProviderModals";
import { postAction, deleteAction, putAction } from "@/api/manage";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import JEllipsis from "@/components/jeecg/JEllipsis";

export default {
  name: "ProviderList",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    ProviderModals
  },
  data() {
    return {
      description: "服务商分销比例列表",
      fenxiao: true,
      vipsorter: {
        order: "desc"
      },
      // 表头
      columns: [
        {
          title: "角色",
          align: "center",
          dataIndex: "role",
          customRender: function(text) {
            if (text == "1") {
              return "VIP";
            } else if (text == "2") {
              return "创客达人";
            } else if (text == "3") {
              return "大使服务商";
            }
          }
        },
        {
          title: "星级",
          align: "center",
          dataIndex: "level"
        },
        {
          title: "VIP分销",
          align: "center",
          dataIndex: "vipRatio",
          scopedSlots: { customRender: "rebate" }
        },
        {
          title: "创客达人分销",
          align: "center",
          dataIndex: "creatorRatio",
          scopedSlots: { customRender: "rebate1" }
        },
        {
          title: "大使服务商分销",
          align: "center",
          dataIndex: "ambassadorRatio",
          scopedSlots: { customRender: "rebate2" }
        },

        {
          title: "升级数量",
          align: "center",
          dataIndex: "upgradeNum"
        },

        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/system/service/distribution/list",
        delete: "/system/service/distribution/delete"
      }
    };
  },
  methods: {
    handleDelete: function(record) {
      console.log(record);
      var id = record.id;
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!");
        return;
      }
      var that = this;
      deleteAction(that.url.delete, { id: id }).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>