<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="28">
          <a-col :md="5" :sm="5">
            <a-form-item label="被邀请人手机号">
              <a-input placeholder="请输入被邀请人手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="5">
            <a-form-item label="被邀请人v云号">
              <a-input placeholder="请输入被邀请人v云号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="邀请人手机号">
              <a-input placeholder="请输入邀请人手机号" v-model="queryParam.invitePhone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="邀请人v云号">
              <a-input placeholder="请输入邀请人v云号" v-model="queryParam.inviteCode"></a-input>
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
      >
        <span slot="antionSet" slot-scope="text, record">
          <a @click="handleSet(record)">设置</a>
          
        </span>
      </a-table>
    </div>
    <!-- 表单区域 -->
    <InvitaionMoudles ref="modalForm" @ok="modalFormOk"></InvitaionMoudles>
     <!-- <user-under-list ref="modalForm" @ok="modalFormOk"></user-under-list> -->
  </a-card>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import InvitaionMoudles from "./modules/InvitaionMoudles";
export default {
  name: "InvitationTable",
  mixins: [JeecgListMixin],
  components: {
    InvitaionMoudles
  },
  data() {
    return {
      description: "邀请关系表",
      type: "ambassadorList1",
      columns: [
        {
          title: "被邀请人昵称",
          align: "center",
          dataIndex: "nickName"
        },
        {
          title: "被邀请人手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "被邀请人v云号",
          align: "center",
          dataIndex: "code"
        },
         {
          title: "注册时间",
          align: "center",
          dataIndex: "createTime"
        },
        {
          title: "邀请人昵称",
          align: "center",
          dataIndex: "inviteNickName"
        },
        {
          title: "邀请人手机号",
          align: "center",
          dataIndex: "invitePhone"
        },
        {
          title: "邀请人账号",
          align: "center",
          dataIndex: "inviteCode"
        },
         {
          title: "操作",
          dataIndex: "antionSet",
          align: "center",
          scopedSlots: { customRender: "antionSet" }
        }
      ],
      url: {
        list: "/system/appuserinfo/invite-relation-list"
      }
    };
  },
  methods: {
    handleSet(record){
      this.$refs.modalForm.open(record);
    }
  },
};
</script>

<style>
</style>