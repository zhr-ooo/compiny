<template>
  <a-card :bordered="false">
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
          <a @click.stop="handleDetail(record)">详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <give ref="modalForm" @ok="modalFormOk"></give>
  </a-card>
</template>

<script>
import give from "./modules/give";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import JEllipsis from "@/components/jeecg/JEllipsis";

export default {
  name: "FreeAccount",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    give
  },
  data() {
    return {
      description: "赠送账号管理页面",
      fenxiao: true,
      vipsorter: {
        order: "desc"
      },
      // 表头
      columns: [
           {
          title: "角色",
          align: "center",
          dataIndex: "identity"
        },
        {
          title: "VIP数量",
          align: "center",
          dataIndex: "vipNumber"
        },
        {
          title: "创客达人数量",
          align: "center",
          dataIndex: "creatorNumber"
        },
        {
          title: "大使服务商数量",
          align: "center",
          dataIndex: "ambassadorNumber"
        },
       
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/other/giving-number/list"
      }
    };
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>