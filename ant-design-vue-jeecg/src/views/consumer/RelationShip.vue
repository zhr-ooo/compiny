<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="28">
          <a-col :md="5" :sm="5">
            <a-form-item label="邀请用户名称">
              <a-input placeholder="请输入邀请用户名称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
             <a-col :md="5" :sm="5">
            <a-form-item label="V云号">
              <a-input placeholder="请输入V云号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
            <a-col :md="5" :sm="5">
            <a-form-item label="被邀请人名称">
              <a-input placeholder="请输入被邀请人名称" v-model="queryParam.invitedName"></a-input>
            </a-form-item>
          </a-col>
            <a-col :md="5" :sm="5">
            <a-form-item label="被邀请人V云号">
              <a-input placeholder="请输入被邀请人V云号" v-model="queryParam.invitedCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
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
    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>-->
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
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import InvitaionMoudles from "./modules/InvitaionMoudles";
export default {
  name: "RelationShip",
  mixins: [JeecgListMixin],
  components: {
    InvitaionMoudles
  },
  data() {
    return {
      description: "邀请奖励关系表",
      columns: [
        {
          title: "被邀请用户v云号",
          align: "center",
          dataIndex: "invitedCode"
        },
        {
          title: "被邀请用户名称",
          align: "center",
          dataIndex: "invitedName"
        },
        {
          title: "被邀请用户角色",
          align: "center",
          dataIndex: "invitedRole",
          customRender: function(text) {
            if (text == "1") {
              return "VIP";
            } else if (text == "2") {
              return "创客达人";
            } else if (text == "3") {
              return "大使服务商";
            }
          }
        },
        {
          title: "邀请用户v云号",
          align: "center",
          dataIndex: "code"
        },
        {
          title: "邀请用户名称",
          align: "center",
          dataIndex: "nickName"
        },
        {
          title: "邀请用户角色",
          align: "center",
          dataIndex: "role",
          customRender: function(text) {
            if (text == "1") {
              return "VIP";
            } else if (text == "2") {
              return "创客达人";
            } else if (text == "3") {
              return "大使服务商";
            }
          }
        },
        {
          title: "直推比例",
          align: "center",
          dataIndex: "ratio"
        },
        // {
        //   title: "操作",
        //   dataIndex: "antionSet",
        //   align: "center",
        //   scopedSlots: { customRender: "antionSet" }
        // }
      ],
      url: {
        list: "/system/invite/relation/list"
      }
    };
  },
  methods: {}
};
</script>

<style>
</style>