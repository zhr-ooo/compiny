<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="类别id">
              <a-input placeholder="请输入类别id" v-model="queryParam.type"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="类别对应的主体的类名全称">
              <a-input placeholder="请输入类别对应的主体的类名全称" v-model="queryParam.classname"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="被关注主体记录总关注/收藏的字段名称">
              <a-input placeholder="请输入被关注主体记录总关注/收藏的字段名称" v-model="queryParam.supportfiledname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="被关注主体应存储标题是什么">
              <a-input placeholder="请输入被关注主体应存储标题是什么" v-model="queryParam.commentfiledname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="关注主体描述">
              <a-input placeholder="请输入关注主体描述" v-model="queryParam.descr"></a-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('评论/点赞类型')">导出</a-button>
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
    <commentSupportType-modal ref="modalForm" @ok="modalFormOk"></commentSupportType-modal>
  </a-card>
</template>

<script>
  import CommentSupportTypeModal from './modules/CommentSupportTypeModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "CommentSupportTypeList",
    mixins:[JeecgListMixin],
    components: {
      CommentSupportTypeModal
    },
    data () {
      return {
        description: '评论/点赞类型管理页面',
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
            title: '类别id',
            align:"center",
            dataIndex: 'type'
           },
		   {
            title: '类别对应的主体的类名全称',
            align:"center",
            dataIndex: 'classname'
           },
		   {
            title: '被关注主体记录总关注/收藏的字段名称',
            align:"center",
            dataIndex: 'supportfiledname'
           },
		   {
            title: '被关注主体应存储标题是什么',
            align:"center",
            dataIndex: 'commentfiledname'
           },
		   {
            title: '关注主体描述',
            align:"center",
            dataIndex: 'descr'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/product/commentSupportType/list",
          delete: "/product/commentSupportType/delete",
          deleteBatch: "/product/commentSupportType/deleteBatch",
          exportXlsUrl: "product/commentSupportType/exportXls",
          importExcelUrl: "product/commentSupportType/importExcel",
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