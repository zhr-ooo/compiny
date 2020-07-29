<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="快递公司">
              <!-- <a-input placeholder="请输入快递公司" v-model="queryParam.name"></a-input> -->
                <a-select placeholder="请选择课程分类" v-model="queryParam.name">
                <a-select-option v-for="(item, index) in selectList" :key="index" :value="item.name">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="3">
            <span
              style="float: left;overflow: hidden;margin-left:8px"
              class="table-page-search-submitButtons"
            >
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--  分润 -->
    <!-- 表格区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>
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
        <span slot="header" slot-scope="text">
          <a-avatar
            shape="square"
            size="large"
            :src="text"
            :srcSet="text"
            @click.stop="bigImg(text)"
          ></a-avatar>
        </span>
        <span slot="action" slot-scope="text, record" @click.stop>
          <a @click.stop="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a style="color: red">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- 表单区域 -->
    <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <express-modals ref="modalForm" @ok="modalFormOk"></express-modals>
  </a-card>
</template>

<script>
import { postAction, deleteAction,getAction } from "@/api/manage";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";

import JEllipsis from "@/components/jeecg/JEllipsis";
import ExpressModals from "./modules/ExpressModals";
export default {
  name: "ExpressCompany",
  mixins: [JeecgListMixin],
  components: {
    ExpressModals,
    ProductNewBigImg,
    JEllipsis
  },

  data() {
    return {
      description: "快递公司",
      selectList:[],
      columns: [
        {
          title: "公司名称",
          align: "center",
          dataIndex: "name"
        },
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "公司标识",
          align: "center",
          dataIndex: "icon",
          scopedSlots: { customRender: "header" }
        },
        {
          title: "是否禁用",
          align: "center",
          dataIndex: "enable",
          customRender: function(text) {
            if (text == 0) {
              return "是";
            } else if (text == 1) {
              return "否";
            }
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/system/mall/company/list",
        delete: "/system/mall/company/delete",
        findCompanyName:"/system/mall/company/findCompanyName"
      }
    };
  },
  created() {
       getAction(this.url.findCompanyName).then((res) => {
         console.log(res)
        if (res.success) {         
          this.selectList = res.result;
        } else {
          this.$message.warning(res.message);
        }
      })
  },
  methods: {
    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
    handleDelete: function(record) {
      var id = record.id;
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!");
        return;
      }
      var that = this;
      deleteAction(that.url.delete, { cId: id }).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    handleMembersList(record) {
      this.$refs.modalForm.open(record);
    }
  }
};
</script>

<style scoped>
@import "~@assets/less/common.less";
.txt {
  height: 30px;
  width: 150px;
}
</style>
