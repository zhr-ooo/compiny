<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
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
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <rechange-modal ref="modalForm" @ok="modalFormOk"></rechange-modal>
  </a-card>
</template>

<script>
  import RechangeModal from './modules/RechangeModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { formatDate } from "@/utils/util";

  export default {
    name: "RechangeList",
    mixins:[JeecgListMixin],
    components: {
      RechangeModal
    },
    data () {
      return {
        description: 'V币充值管理页面',
        // 表头
        columns: [
          {
            title: '支付金额',
            align:"center",
            dataIndex: 'money'
           },
          {
            title: '实际获取独家币',
            align:"center",
            dataIndex: 'trueMoney'
           },
          {
            title: '充值时间',
            align:"center",
            dataIndex: 'createTime',
            customRender: function(text) {
              if (text) {
                return formatDate(text, 'yyyy-MM-dd')
              } else {
                return ' '
              }
              
            }
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/system/rechange/list",
          delete: "/system/rechange/delete"
       },
    }
  },
    methods: {
     
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>