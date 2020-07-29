<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="5" :sm="8">
            <a-form-item label="银行名称">
              <a-input placeholder="请输入银行名称" v-model="queryParam.bankName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="13" :sm="8" >
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
  
        <template slot="logo" slot-scope="text">
          <img :src="text" style="width: 100px;height: 100px;" @click="bigImg(text)" />
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
    <bank-modal ref="modalForm" @ok="modalFormOk"></bank-modal>
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
  import BankModal from './modules/BankModal'
  import ProductNewBigImg from "../product/modules/ProductNewBigImg";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "BankList",
    mixins:[JeecgListMixin],
    components: {
      BankModal,
      ProductNewBigImg
    },
    data () {
      return {
        description: '银行管理页面',
        queryParam: {
          bankName: ''
        },
        param: {
          bankName: ''
        },
        // 表头
        columns: [
          {
            title: '银行名称',
            align:"center",
            dataIndex: 'name'
           },
          {
            title: 'logo',
            align:"center",
            dataIndex: 'logo',
            scopedSlots: { customRender: 'logo' }
           },
          {
            title: '微信银行ID',
            align:"center",
            dataIndex: 'code'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/system/bank/list",
          delete: "/system/bank/delete"
       },
    }
  },
    methods: {}
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>