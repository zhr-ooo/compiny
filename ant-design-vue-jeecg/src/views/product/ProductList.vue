<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="分类ID">
              <a-input placeholder="请输入分类ID" v-model="queryParam.catgoryid"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="一级分类ID">
              <a-input placeholder="请输入一级分类ID" v-model="queryParam.fistcatgory"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="二级分类ID">
              <a-input placeholder="请输入二级分类ID" v-model="queryParam.secondcatgory"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="标题">
              <a-input placeholder="请输入标题" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="图标">
              <a-input placeholder="请输入图标" v-model="queryParam.icon"></a-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('课程/产品表')">导出</a-button>
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
    <product-modal ref="modalForm" @ok="modalFormOk"></product-modal>
  </a-card>
</template>

<script>
  import ProductModal from './modules/ProductModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "ProductList",
    mixins:[JeecgListMixin],
    components: {
      ProductModal
    },
    data () {
      return {
        description: '课程/产品表管理页面',
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
            title: '分类ID',
            align:"center",
            dataIndex: 'catgoryid'
           },
		   {
            title: '一级分类ID',
            align:"center",
            dataIndex: 'fistcatgory'
           },
		   {
            title: '二级分类ID',
            align:"center",
            dataIndex: 'secondcatgory'
           },
		   {
            title: '标题',
            align:"center",
            dataIndex: 'title'
           },
		   {
            title: '图标',
            align:"center",
            dataIndex: 'icon'
           },
		   {
            title: '浏览量',
            align:"center",
            dataIndex: 'viewcount'
           },
		   {
            title: '评论数',
            align:"center",
            dataIndex: 'commentcount'
           },
		   {
            title: '类型1纯文字、2纯图片、3纯视频、4纯音频、5图文、6视频与图文、7音频与图文',
            align:"center",
            dataIndex: 'contenttype'
           },
		   {
            title: '内容（纯文字/图文）',
            align:"center",
            dataIndex: 'content'
           },
		   {
            title: '图片（多张以；隔开）',
            align:"center",
            dataIndex: 'images'
           },
		   {
            title: '视频/音频地址',
            align:"center",
            dataIndex: 'videourl'
           },
		   {
            title: '视频/音频时长',
            align:"center",
            dataIndex: 'videotime'
           },
		   {
            title: '视频第一针图片',
            align:"center",
            dataIndex: 'videoimage'
           },
		   {
            title: '发布时间',
            align:"center",
            dataIndex: 'createtime'
           },
		   {
            title: '作者名',
            align:"center",
            dataIndex: 'authorname'
           },
		   {
            title: '作者ID',
            align:"center",
            dataIndex: 'authorid'
           },
		   {
            title: '作者描述',
            align:"center",
            dataIndex: 'author'
           },
		   {
            title: '1、免费；2、会员；3、付费',
            align:"center",
            dataIndex: 'type'
           },
		   {
            title: '付费金额',
            align:"center",
            dataIndex: 'price'
           },
		   {
            title: '是否推荐到分类',
            align:"center",
            dataIndex: 'iscategoryrecomed'
           },
		   {
            title: '是否推荐到首页',
            align:"center",
            dataIndex: 'isindexrecomend'
           },
		   {
            title: '直播间号',
            align:"center",
            dataIndex: 'roomid'
           },
		   {
            title: '聊天室ID',
            align:"center",
            dataIndex: 'groupid'
           },
		   {
            title: '点赞数',
            align:"center",
            dataIndex: 'topcount'
           },
		   {
            title: '审核状态： 0审核中 1审核成功 2审核失败',
            align:"center",
            dataIndex: 'status'
           },
		   {
            title: '拒绝原因',
            align:"center",
            dataIndex: 'refusereason'
           },
		   {
            title: '是否删除 0否1是',
            align:"center",
            dataIndex: 'del'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/product/productNew/list",
          delete: "/product/productNew/delete",
          deleteBatch: "/product/productNew/deleteBatch",
          exportXlsUrl: "product/productNew/exportXls",
          importExcelUrl: "product/productNew/importExcel",
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
