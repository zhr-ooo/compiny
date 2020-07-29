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
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record" v-show="record.id !== 10000">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
          <span slot="avatar" slot-scope="text">
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
    <productCategory-modal ref="modalForm" @ok="modalFormOk"></productCategory-modal>
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
import ProductCategoryModal from "./modules/ProductCategoryModal";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import ProductNewBigImg from "./modules/ProductNewBigImg";
export default {
  name: "ProductCategoryList",
  mixins: [JeecgListMixin],
  components: {
    ProductCategoryModal,
    ProductNewBigImg
  },
  data() {
    return {
      description: "课程/产品分类表管理页面",
      // 表头
      columns: [
        {
          title: "分类名称",
          align: "center",
          dataIndex: "name"
        },
        {
          title: "导航",
          align: "center",
          dataIndex: "icon",
          customRender: function(text) {
            if (text === "y") {
              return "显示";
            } else if (text === "n") {
              return "不显示";
            }
          }
        },
        {
          title: "课程图片",
          align: "center",
          dataIndex: "imageUrl",
           scopedSlots: { customRender: "avatar" }
        },
        {
          title: "排序",
          align: "center",
          dataIndex: "sorts"
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/product/productCategory/rootList",
        delete: "/product/productCategory/delete",
        deleteBatch: "/product/productCategory/deleteBatch",
        exportXlsUrl: "product/productCategory/exportXls",
        importExcelUrl: "product/productCategory/importExcel"
      }
    };
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG["domianURL"]}/${this.url.importExcelUrl}`;
    }
  },
  methods: {
      bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    }
  }
};
</script>
<style scoped>
</style>
