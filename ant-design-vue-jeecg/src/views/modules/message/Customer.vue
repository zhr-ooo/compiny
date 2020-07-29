<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="5" :sm="5">
            <a-form-item label="问题：">
              <a-input placeholder="请输入问题" v-model="queryParam.question"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="回答：">
              <a-input placeholder="请输入答案" v-model="queryParam.answers"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="类型">
              <a-select placeholder="请选择类型" v-model="queryParam.type">
                <a-select-option :value="1">充值</a-select-option>
                <a-select-option :value="2">课程</a-select-option>
                <a-select-option :value="3">群聊</a-select-option>
                <a-select-option :value="4">提现</a-select-option>
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
        <span slot="templateTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="400"></j-ellipsis>
        </span>
        <span slot="action" slot-scope="text, record" @click.stop>
          <a @click.stop="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a style="color: red">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <custom-modals ref="modalForm" @ok="modalFormOk"></custom-modals>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import { getAction, deleteAction } from "@/api/manage";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import JEllipsis from "@/components/jeecg/JEllipsis";
import customModals from "./modules/customModals";
export default {
  name: "Customer",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    customModals,
  },
  data() {
    return {
      description: "客服问答页面",
      typeList: [],
      // 表头
      columns: [
        {
          title: "问题",
          align: "center",
          dataIndex: "question",
          width:450,
          scopedSlots: { customRender: "templateTitle" }
        },
        {
          title: "回答",
          align: "center",
          dataIndex: "answers",
          width: 450,
          scopedSlots: { customRender: "templateTitle" }
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime"
        },
        {
          title: "问题类型",
          align: "center",
          dataIndex: "type",
          customRender: function(text) {
            if (text == 1) {
              return "充值";
            } else if (text == 2) {
              return "课程";
            } else if (text == 3) {
              return "群聊";
            } else if (text == 4) {
              return "提现";
            }
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/system/que/answer/list",
        delete: "/system/que/answer/delete"
      }
    };
  },
  created() {},
  methods: {
    handleDelete: function(record) {
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
    },

  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
