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
    <reward-retail-modal ref="modalForm" @ok="modalFormOk"></reward-retail-modal>
  </a-card>
</template>

<script>
import RewardRetailModal from "./modules/RewardRetailModal";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import JEllipsis from "@/components/jeecg/JEllipsis";

export default {
  name: "RewardRetailList",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    RewardRetailModal
  },
  data() {
    return {
      description: "打赏分销管理页面",
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
          title: "本人获得打赏收益",
          align: "center",
          dataIndex: "rewardme"
        },
        {
          title: "直推打赏他人",
          align: "center",
          dataIndex: "directlyrewardother"
        },
        {
          title: "间推打赏他人",
          align: "center",
          dataIndex: "indirectrewardother"
        },
        {
          title: "直推被打赏",
          align: "center",
          dataIndex: "directlyreward"
        },
        {
          title: "免费奖励",
          align: "center",
          dataIndex: "freeReward"
        },
        {
          title: "转发者",
          align: "center",
          dataIndex: "forwarding"
        },

        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/other/forwardFenxiao/list"
      }
    };
  },
  methods: {}
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>