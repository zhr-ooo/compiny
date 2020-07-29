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
        @change="handleTableChange"
        :customRow="clickThenCheck">

        <span slot="action" slot-scope="text, record" @click.stop>
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
    <abouus-modal ref="modalForm" @ok="modalFormOk"></abouus-modal>
  </a-card>
</template>

<script>
  import AbouusModal from './modules/AbouusModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { formatDate } from "@/utils/util";

  export default {
    name: "AbouusList",
    mixins:[JeecgListMixin],
    components: {
      AbouusModal
    },
    data () {
      return {
        description: '关于我们管理页面',
        // 表头
        columns: [
          {
            title: '标题',
            align:"center",
            dataIndex: 'title'
           },
          {
            title: '时间',
            align:"center",
            dataIndex: 'createTime',
            customRender: function(text) {
              if (text) {
                return formatDate(text, 'yyyy-MM-dd')
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
          list: "/system/aboutus/list",
          delete: "/system/aboutus/delete"
        },
    }
  },
    methods: {
      clickThenCheck (record) {
        return {
          on: {
            click: () => {
              this.$refs.modalForm.edit(record);
              this.$refs.modalForm.title = "详情";
              this.$refs.modalForm.disableSubmit = true;
            }
          }
        }
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>