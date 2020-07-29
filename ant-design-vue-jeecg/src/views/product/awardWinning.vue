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
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete1(record.id)">
            <a style="color:red">删除</a>
          </a-popconfirm>
        </span>
        <span slot="header" slot-scope="text">
          <a-avatar
            shape="square"
            size="large"
            :src="text"
            :srcSet="text"
            @click.stop="bigImg(text)"
          ></a-avatar>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <award-card ref="modalForm" @ok="modalFormOk"></award-card>
       <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
  import awardCard from './modules/awardCard'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ProductNewBigImg from "../product/modules/ProductNewBigImg";
  import {deleteAction} from "@/api/manage";
  export default {
    name: "awardWinning",
    mixins:[JeecgListMixin],
    components: {
      awardCard,
      ProductNewBigImg
    },
    data () {
      return {
        description: '有奖问答分类页面',
        // 表头
        columns: [
          {
            title: '名称',
            align:"center",
            dataIndex: 'name'
           },
           {
            title: '图标',
            align:"center",
            dataIndex: 'icon',
            scopedSlots: { customRender: "header" }
           },
           {
            title: '排序',
            align:"center",
            dataIndex: 'sort',
            
           },
          {
            title: '用户级别',
            align:"center",
            dataIndex: 'parentId',
            customRender: function (text) {
              if (text === 1) {
                return 'VIP用户';
              } else if (text === 2) {
                return '普通用户';
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
          list: "/system/question/category/list",
          delete: "/system/question/category/delete",
          deleteBatch: "/product/productCategory/deleteBatch",
          exportXlsUrl: "product/productCategory/exportXls",
          importExcelUrl: "product/productCategory/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
        //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
      handleDelete1: function (id) {
      if(!this.url.delete){
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, {categoryId: id}).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    }
  }
</script>
<style scoped>
</style>
