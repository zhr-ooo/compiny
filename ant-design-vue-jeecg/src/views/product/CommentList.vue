<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="评论用户ID">
              <a-input placeholder="请输入评论用户ID" v-model="queryParam.userid"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="评论内容">
              <a-input placeholder="请输入评论内容" v-model="queryParam.content"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="点赞量">
              <a-input placeholder="请输入点赞量" v-model="queryParam.topcount"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="回复数量">
              <a-input placeholder="请输入回复数量" v-model="queryParam.replycount"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="对应的id">
              <a-input placeholder="请输入对应的id" v-model="queryParam.itemid"></a-input>
            </a-form-item>
          </a-col>
          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('评论表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <comment-modal ref="modalForm" @ok="modalFormOk"></comment-modal>
  </a-card>
</template>

<script>
  import CommentModal from './modules/CommentModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "CommentList",
    mixins:[JeecgListMixin],
    components: {
      CommentModal
    },
    data () {
      return {
        description: '评论表管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },
		   {
            title: '评论用户ID',
            align:"center",
            dataIndex: 'userid'
           },
		   {
            title: '评论内容',
            align:"center",
            dataIndex: 'content'
           },
		   {
            title: '点赞量',
            align:"center",
            dataIndex: 'topcount'
           },
		   {
            title: '回复数量',
            align:"center",
            dataIndex: 'replycount'
           },
		   {
            title: '对应的id',
            align:"center",
            dataIndex: 'itemid'
           },
		   {
            title: '1、课程与产品；2有奖问答',
            align:"center",
            dataIndex: 'type'
           },
		   {
            title: '评论时间',
            align:"center",
            dataIndex: 'createtime'
           },
		   {
            title: '被回复的评论ID',
            align:"center",
            dataIndex: 'replyid'
           },
		   {
            title: '被回复的用户ID',
            align:"center",
            dataIndex: 'replyuserid'
           },
		   {
            title: '级别',
            align:"center",
            dataIndex: 'level'
           },
		   {
            title: '回复的评论数',
            align:"center",
            dataIndex: 'commentnumber'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/product/comment/list",
          delete: "/product/comment/delete",
          deleteBatch: "/product/comment/deleteBatch",
          exportXlsUrl: "product/comment/exportXls",
          importExcelUrl: "product/comment/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
     
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>