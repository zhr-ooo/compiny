<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="市区">
              <a-input placeholder="请输入市区" v-model="queryParam.area"></a-input>
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
      ></a-table>
    </div>
    <!-- 表单区域 -->

    <!-- <user-under-list ref="modalForm" @ok="modalFormOk"></user-under-list> -->
  </a-card>
</template>

<script>
import { postAction } from "@/api/manage";

import { JeecgListMixin } from "@/mixins/JeecgListMixin";

import JEllipsis from "@/components/jeecg/JEllipsis";
// import UserUnderList from "./modules/UserUnderList";
export default {
  name: "UserAddress",
  mixins: [JeecgListMixin],
  components: {
    // UserUnderList,
    JEllipsis
  },

  data() {
    return {
      description: "用户地址",

      // queryParam: {
      //   rate: this.total
      // },
      columns: [
        {
          title: "姓名",
          align: "center",
          dataIndex: "name"
        },
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "市区",
          align: "center",
          dataIndex: "area"
        },
        {
          title: "地址",
          align: "center",
          dataIndex: "address"
        }
      ],
      url: {
        list: "/system/mall/address/list"
      }
    };
  },

  methods: {
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
