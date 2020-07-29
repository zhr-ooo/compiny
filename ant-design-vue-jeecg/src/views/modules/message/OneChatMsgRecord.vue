<template>
  <a-card :bordered="false">
    
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          
          <a-col :md="6" :sm="8">
            <a-form-item label="发言人">
              <a-input placeholder="请输入发言人" v-model="queryParam.fromnick"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="接收人">
              <a-input placeholder="请输入接收人" v-model="queryParam.tonick"></a-input>
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
          <a :href="record.file" title="点击查看"v-if="record.meaasgeType === 4">文件</a>
          <a :href="record.vdo" title="点击查看"v-if="record.meaasgeType === 5">视频</a>
          <a :href="record.img" title="点击查看"v-if="record.meaasgeType === 3">图片</a>
          <a :href="record.audio" title="点击查看"v-if="record.meaasgeType === 2">音频</a>
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
    name: "OneChatMsgRecord",
    mixins: [JeecgListMixin],
    components: {
      JEllipsis
    },
    data() {
      return {
        description: '消息模板管理页面',
        queryParam: {
          fromnick: '',
          tonick: '',
          type: null
        },
        param: {
          romnick: '',
          tonick: '',
          type: null
        },
        // 表头
        columns: [
          {
            title: '发言人',
            align: "center",
            dataIndex: 'fromnick'
          },
          {
            title: '接收人',
            align: "center",
            dataIndex: 'tonick'
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
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   align: "center",
          //   scopedSlots: {customRender: 'action'},
          // }
        ],
        url: {
          list: "/system/singHisMessage/list",
          exportXlsUrl: "message/sysMessageTemplate/exportXls",
          importExcelUrl: "message/sysMessageTemplate/importExcel",
        },
      }
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
</style>