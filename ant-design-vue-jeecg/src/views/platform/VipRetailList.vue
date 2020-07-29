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
    <vip-retail-modal ref="modalForm" @ok="modalFormOk"></vip-retail-modal>
  </a-card>
</template>

<script>
import VipRetailModal from "./modules/VipRetailModal";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import JEllipsis from "@/components/jeecg/JEllipsis";

export default {
  name: "VipRetailList",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    VipRetailModal
  },
  data() {
    return {
      description: "VIP分销管理页面",
      fenxiao: true,
      vipsorter: {
        order: "desc"
      },
      // 表头
      columns: [
        {
          title: "分销角色",
          align: "center",
          dataIndex: "identity"
        },
        {
          title: "直推",
          align: "center",
          dataIndex: "directly"
        },
        {
          title: "间推",
          align: "center",
          dataIndex: "indirect"
        },
        {
          title: "直推创客或大使",
          align: "center",
          dataIndex: "directlyHigh"
        },
        {
          title: "间推创客或大使",
          align: "center",
          dataIndex: "indirectHigh"
        },
        {
          title: "课程引导奖",
          align: "center",
          dataIndex: "guide"
        },
        {
          title: "课程发布者师傅",
          align: "center",
          dataIndex: "autherSuper"
        },
        {
          title: "转发者",
          align: "center",
          dataIndex: "forwarding"
        },
        {
          title: "团队业绩总流水分销",
          align: "center",
          dataIndex: "teamPerformance"
        },
        {
          title: "奖金池达标分红",
          align: "center",
          dataIndex: "standardRate"
        },
        {
          title: "官方奖励",
          align: "center",
          dataIndex: "officialReward"
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/other/vipFenxiao/list"
      }
    };
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>