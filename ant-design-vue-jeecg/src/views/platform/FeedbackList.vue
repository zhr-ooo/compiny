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
        :customRow="clickThenCheck">
        
        <span slot="logContent" slot-scope="text">
          <j-ellipsis :value="text" :length="50"/>
        </span>
      </a-table>
      
    </div>
    <!-- table区域-end -->
    
    <!-- 表单区域 -->
    <feedback-modal ref="modalForm" @ok="modalFormOk"></feedback-modal>
  </a-card>
</template>

<script>
  import FeedbackModal from './modules/FeedbackModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import { formatDate } from '@/utils/util'

  export default {
    name: "FeedbackList",
    mixins:[JeecgListMixin],
    components: {
      FeedbackModal,
      JEllipsis
    },
    data () {
      return {
        description: '意见反馈列表页面',
        // 表头
        columns: [
          {
            title: '手机号',
            align:"center",
            dataIndex: 'phone'
           },
          {
            title: '反馈者名称',
            align:"center",
            dataIndex: 'name'
           },
          {
            title: '反馈内容',
            align:"center",
            dataIndex: 'content',
            scopedSlots: { customRender: 'logContent' },
           },
          {
            title: '反馈时间',
            align:"center",
            dataIndex: 'createTime',
            customRender: function(text) {
              if (text) {
                return formatDate(text, 'yyyy-MM-dd')
              } else {
                return text
              }
            }
           },
        ],
        url: {
          list: "/system/feedback/list"
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