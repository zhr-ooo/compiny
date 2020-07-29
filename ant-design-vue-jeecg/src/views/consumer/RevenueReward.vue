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
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改团队信息</a>

          <a-divider type="vertical" />
          <a @click="handleLook(record)">查看团队成员</a>
          <a-divider type="vertical" />
          <a @click="handleAddYuan(record)">增加团队成员</a>
        </span>
        <!-- 被邀请人信息 -->
        <template slot="invit" slot-scope="text, record">
          <span slot="invit">{{ record.nickName }}-</span>
          <span slot="invit">{{ record.phone }}-</span>
          <span slot="invit">{{ record.code }}</span>
        </template>
        <!-- 邀请人信息 -->
        <template slot="invit1" slot-scope="text, record">
          <span slot="invit1">{{ record.inviteNickName }}-</span>
          <span slot="invit1">{{ record.invitePhone }}-</span>
          <span slot="invit1">{{ record.inviteCode }}</span>
        </template>
        <!-- 邀请人分润比例 -->
        <template slot="fenRate" slot-scope="text, record">
          <span slot="fenRate">{{ record.rate | toPercentage }}</span>
        </template>
        <!-- 被邀请人分润比例 -->
        <template slot="fenRate1" slot-scope="text, record">
          <span slot="fenRate1">{{ record.rate1 | toPercentage }}</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确定分润吗?" @confirm="() => shareRate(record)">
            <a>分润</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- 表单区域 -->
    <official-list-modal1 ref="modalForm" @ok="modalFormOk"></official-list-modal1>
  </a-card>
</template>

<script>
import { postAction } from "@/api/manage";
import OfficialListModal1 from "./modules/OfficialListModal1";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
export default {
  name: "RevenueReward",
  mixins: [JeecgListMixin],
  components: {
    OfficialListModal1
  },
  data() {
    return {
      description: "收益奖励列表",
      type: "ambassadorList1",
      isAll: "",
      columns: [
        {
          title: "被邀请人信息",
          align: "center",
          dataIndex: "nickName",
          scopedSlots: { customRender: "invit" }
        },

        // {
        //   title: "被邀请人手机号",
        //   align: "center",
        //   dataIndex: "phone"
        // },
        // {
        //   title: "被邀请人v云号",
        //   align: "center",
        //   dataIndex: "code"
        // },
        {
          title: "被邀请人角色",
          align: "center",
          dataIndex: "userRoleName"
        },
        {
          title: "充值总费用",
          align: "center",
          dataIndex: "totalMoney"
        },

        {
          title: "被邀请人分润比例",
          align: "center",
          dataIndex: "rate1",
          scopedSlots: { customRender: "fenRate1" }
        },
        {
          title: "被邀请人分润金额",
          align: "center",
          dataIndex: "shareProfitMoney1",
          scopedSlots: { customRender: "share" }
        },
        // {
        //   title: "邀请人手机号",
        //   align: "center",
        //   dataIndex: "invitePhone"
        // },
        // {
        //   title: "邀请人账号",
        //   align: "center",
        //   dataIndex: "inviteCode"
        // },
        {
          title: "邀请人信息",
          align: "center",
          dataIndex: "inviteNickName",
          scopedSlots: { customRender: "invit1" }
        },
        {
          title: "邀请人角色",
          align: "center",
          dataIndex: "inviteUserRoleName"
        },

        {
          title: "邀请人分润比例",
          align: "center",
          dataIndex: "rate",
          scopedSlots: { customRender: "fenRate" }
        },

        {
          title: "邀请人分润金额",
          align: "center",
          dataIndex: "shareProfitMoney",
          scopedSlots: { customRender: "share" }
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "rids",
          width: 100,
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/system/appuserinfo/earnings-reward-list",
        share: "/system/appuserinfo/earnings-reward-profit"
      }
    };
  },
  methods: {
    // 单个分润
    shareRate: function(record) {
      var that = this;
      let arr = `?rids=${record.rids}`;

      postAction(that.url.share + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          console.log(res);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    }
  }
};
</script>

<style>
</style>