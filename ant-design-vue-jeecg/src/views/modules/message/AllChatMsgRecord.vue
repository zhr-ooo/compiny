<template>
  <a-card :bordered="false">
    
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          
          <a-col :md="6" :sm="8">
            <a-form-item label="群名称">
              <a-input placeholder="请输入群名称" v-model="queryParam.groupName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="消息类型">
              <a-select placeholder="请选择消息类型" v-model="queryParam.type">
                <a-select-option :value="0">文本</a-select-option>
                <a-select-option :value="2">音频</a-select-option>
                <a-select-option :value="3">图片</a-select-option>
                <a-select-option :value="4">文件</a-select-option>
                <a-select-option :value="5">视频</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        
        </a-row>
      </a-form>
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
        
        <!-- 字符串超长截取省略号显示-->
        <span slot="templateContent" slot-scope="text, record">
          <j-ellipsis :value="text" :length="25" v-if="record.meaasgeType === 0" />
          <a :href="record.file" title="点击查看" v-if="record.meaasgeType === 4">文件</a>
          <a :href="record.vdo" title="点击查看" v-if="record.meaasgeType === 5">视频</a>
          <a :href="record.img" title="点击查看" v-if="record.meaasgeType === 3">图片</a>
          <a :href="record.audio" title="点击查看" v-if="record.meaasgeType === 2">音频</a>
        </span>
      
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";

  export default {
    name: "AllChatMsgRecord",
    mixins: [JeecgListMixin],
    components: {
      JEllipsis
    },
    data() {
      return {
        description: '消息模板管理页面',
        queryParam: {
          groupName: '',
          type: null
        },
        param: {
          groupName: '',
          type: null
        },
        // 表头
        columns: [
          {
            title: '群名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '发言人',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '消息类型',
            align: "center",
            dataIndex: 'meaasgeType',
            customRender: function(text) {
              if (text === 0) {
                return '文本'
              } else if (text === 2) {
                return '音频'
              } else if (text === 3) {
                return '图片'
              } else if (text === 4) {
                return '文件'
              } else if (text === 5) {
                return '视频'
              }
            }
          },
          {
            title: '消息内容',
            align: "center",
            dataIndex: 'meaasgeContent',
            scopedSlots: {customRender: 'templateContent'},
          },
          {
            title: '发言时间',
            align: "center",
            dataIndex: 'msgtime'
          },
        ],
        url: {
          list: "/system/groupHisMessage/list",
          exportXlsUrl: "message/sysMessageTemplate/exportXls",
          importExcelUrl: "message/sysMessageTemplate/importExcel",
        },
      }
    },
    computed: {},
    methods: {
      handleTest(record){
        this.$refs.testModal.open(record);
        this.$refs.testModal.title = "发送测试";
      }

    }
  }
</script>
<style lang="less" scoped>
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }
  
  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }
  
  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }
  
  .anty-row-operator button {
    margin: 0 5px
  }
  
  .ant-btn-danger {
    background-color: #ffffff
  }
  
  .ant-modal-cust-warp {
    height: 100%
  }
  
  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }
  
  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>