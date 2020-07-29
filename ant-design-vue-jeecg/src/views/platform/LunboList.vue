<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="5" :sm="8">
            <a-form-item label="位置">
              <a-select placeholder="请选择位置" v-model="queryParam.address">
                <a-select-option :value="1">首页</a-select-option>
                <a-select-option :value="2">分类</a-select-option>
                <a-select-option :value="3">直播间</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="轮播图类型">
              <a-select placeholder="请选择轮播图类型" v-model="queryParam.type">
                <a-select-option :value="1">课程/产品</a-select-option>
                <a-select-option :value="2">直播列表</a-select-option>
                <a-select-option :value="3">url</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
  
        <template slot="image" slot-scope="text">
          <img :src="text" style="width: 100px;max-height: 100px;" @click="bigImg(text)" />
        </template>

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
    <lunbo-modal ref="modalForm" @ok="modalFormOk"></lunbo-modal>
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
  import LunboModal from './modules/LunboModal'
  import ProductNewBigImg from "../product/modules/ProductNewBigImg";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { formatDate } from "@/utils/util";

  export default {
    name: "LunboList",
    mixins:[JeecgListMixin],
    components: {
      LunboModal,
      ProductNewBigImg
    },
    data () {
      return {
        description: '轮播图管理页面',
        queryParam: {
          address: '',
          type: ''
        },
        param: {
          address: '',
          type: ''
        },
        // 表头
        columns: [
          {
            title: '位置',
            align:"center",
            dataIndex: 'position',
            customRender: function(text) {
              if (text === 1) {
                return '首页'
              } else if (text === 2) {
                return '分类'
              } else if (text === 3) {
                return '直播间'
              }
            }
           },
          {
            title: '轮播类型',
            align:"center",
            dataIndex: 'type',
            customRender: function(text) {
              if (text === 1) {
                return '课程/产品'
              } else if (text === 2) {
                return '直播列表'
              } else if (text === 3) {
                return 'url'
              } else if (text === 4) {
                return '排行榜'
              }
            }
           },
          {
            title: '地址',
            align:"center",
            dataIndex: 'url'
           },
          {
            title: '图片',
            align:"center",
            dataIndex: 'image',
            scopedSlots: { customRender: 'image' }
           },
          {
            title: '时间',
            align:"center",
            dataIndex: 'createTime',
            customRender: function(text) {
              return formatDate(text, 'yyyy-MM-dd hh:mm')
            }
           },
          {
            title: '排序',
            align:"center",
            dataIndex: 'sorts'
           },
          {
            title: '背景颜色色值',
            align:"center",
            dataIndex: 'bgColor'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/system/lunbo/list",
          delete: "/system/lunbo/delete"
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