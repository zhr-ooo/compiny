<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="26">
           <a-col :md="4" :sm="4">
            <a-form-item label="赠送账号类型">
              <a-select placeholder="请选择类型" v-model="queryParam.role">
                <a-select-option value="1">VIP</a-select-option>
                <a-select-option value="2">创客达人</a-select-option>
                <a-select-option value="3">大使服务商</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="被赠送人手机号">
              <a-input placeholder="请输入被赠送人手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="4">
            <a-form-item label="被赠送人v云号">
              <a-input placeholder="请输入被赠送人v云号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="赠送人手机号">
              <a-input placeholder="请输入赠送人手机号" v-model="queryParam.invitePhone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="赠送人v云号">
              <a-input placeholder="请输入赠送人v云号" v-model="queryParam.inviteCode"></a-input>
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
    </div> -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="userId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改团队信息</a>
          <a-divider type="vertical" />
          <a @click="handleLook(record)">查看团队成员</a>
          <a-divider type="vertical" />
          <a @click="handleAddYuan(record)">增加团队成员</a>
        </span>
      </a-table>
    </div>
    <!-- 表单区域 -->
    <official-list-modal1 ref="modalForm" @ok="modalFormOk"></official-list-modal1>
  </a-card>
</template>

<script>
import OfficialListModal1 from "./modules/OfficialListModal1";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
export default {
  name: "OfficialList",
  mixins: [JeecgListMixin],
  components: {
    OfficialListModal1
  },
  data() {
    return {
      description: "官方赠送列表",
      type: "ambassadorList1",
      columns: [
         {
          title: "赠送账号类型",
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
          title: "被赠送人昵称",
          align: "center",
          dataIndex: "nickName"
        },
        {
          title: "被赠送人手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "被赠送人v云号",
          align: "center",
          dataIndex: "code",
        },
        {
          title: "赠送人昵称",
          align: "center",
          dataIndex: "inviteNickName"
        },
        {
          title: "赠送人手机号",
          align: "center",
          dataIndex: "invitePhone"
        },
        {
          title: "赠送人账号",
          align: "center",
          dataIndex: "inviteCode"
        }
      ],
      url: {
        list: "/system/appuserinfo/giving-relation-list"
      }
    };
  }
};
</script>

<style>
</style>