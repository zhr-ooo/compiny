<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="名称">
              <a-input placeholder="请输入名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="价格">
              <a-input placeholder="请输入价格" v-model="queryParam.price"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="是否推荐">
              <a-select v-model="queryParam.isrecommend">
                <a-select-option :value="0">不推荐</a-select-option>
                <a-select-option :value="1">推荐</a-select-option>
                <a-select-option :value="2">特别推荐</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="天数">
                <a-input placeholder="请输入天数" v-model="queryParam.days"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="原价">
                <a-input placeholder="请输入原价" v-model="queryParam.oldprice"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="是否推荐(0:不推荐，1:推荐)">
                <a-input placeholder="请输入是否推荐(0:不推荐，1:推荐)" v-model="queryParam.isrecommend"></a-input>
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
    </div> -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('会员表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

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
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <vip-modal ref="modalForm" @ok="modalFormOk"></vip-modal>
  </a-card>
</template>

<script>
  import VipModal from './modules/VipModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "VipList",
    mixins:[JeecgListMixin],
    components: {
      VipModal
    },
    data () {
      return {
        description: '会员表管理页面',
        // 表头
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key:'rowIndex',
          //   width:60,
          //   align:"center",
          //   customRender:function (t,r,index) {
          //     return parseInt(index)+1;
          //   }
          //  },
           {
            title: '名称',
            align:"center",
            dataIndex: 'name'
           },
          {
            title: '价格',
            align:"center",
            dataIndex: 'price'
           },
          {
            title: '每月的价格',
            align:"center",
            dataIndex: 'everyPrice'
          },
          {
            title: '天数',
            align:"center",
            dataIndex: 'days'
           },
          {
            title: '原价',
            align:"center",
            dataIndex: 'oldPrice'
           },
          {
            title: '是否推荐',
            align:"center",
            dataIndex: 'isRecommend',
            customRender: function (text) {
              if (text === 0) {
                return '不推荐';
              } else if (text === 1) {
                return '推荐'
              } else if (text === 2) {
                return '特别推荐'
              }
            }
           },
          {
            title: '是否自动充值会员',
            align:"center",
            dataIndex: 'isAuto',
            customRender: function (text) {
              if (text == '0') {
                return '否'
              } else if (text == '1') {
                return '是'
              }
            }
           },
          {
            title: '描述',
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
          list: "/other/vip/list",
          delete: "/other/vip/delete",
          deleteBatch: "/other/vip/deleteBatch",
          exportXlsUrl: "other/vip/exportXls",
          importExcelUrl: "other/vip/importExcel",
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
