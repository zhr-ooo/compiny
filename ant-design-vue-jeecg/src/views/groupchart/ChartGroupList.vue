<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="群组名称">
              <a-input placeholder="请输入群组名称" v-model="queryParam.groupName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="群组类型">
              <a-select placeholder="请选择群组类型" v-model="queryParam.groupType">
                <a-select-option :value="0">私有群</a-select-option>
                <a-select-option :value="1">公开群</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
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
        <span slot="icon" slot-scope="text">
          <a-avatar
            shape="square"
            size="large"
            :src="text"
            :srcSet="text"
            @click.stop="bigImg(text)"
          ></a-avatar>
        </span>
        <span slot="templateContent" slot-scope="text">
          <j-ellipsis :value="text" :length="10" />
        </span>

        <template slot="yqcode" slot-scope="text">
          <img :src="text" style="width: 100px;height: 100px;" @click="bigImg(text, 400)" />
        </template>
        <span slot="action" slot-scope="text, record">
          <a style="float:left" @click="handleMembers(record)">成员列表</a>
          <!-- <a-divider type="vertical" />
          <a-popconfirm
            v-if="record.state === 1"
            title="确定冻结该群吗?"
            @confirm="() => handleFreeze(record.id)"
          >
            <a>冻结</a>
          </a-popconfirm>
          <a-popconfirm v-else title="确定解冻该群吗?" @confirm="() => handleThaw(record.id)">
            <a>解冻</a>
          </a-popconfirm> -->

          <!-- <a @click="handleFreeze(record.id)">冻结</a> -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <chat-group-member-modal ref="modalForm" @ok="modalFormOk"></chat-group-member-modal>
  </a-card>
</template>

<script>
import { getAction, postAction } from "@/api/manage";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import ChatGroupMemberModal from "./modules/ChatGroupMemberModal";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { filterObj } from "@/utils/util";
import JEllipsis from "@/components/jeecg/JEllipsis";

export default {
  name: "ChartGroupList",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    ProductNewBigImg,
    ChatGroupMemberModal
  },
  data() {
    return {
      description: "群组管理页面",
      // 表头
      columns: [
        {
          title: "群组名称",
          align: "center",
          dataIndex: "name"
        },
        {
          title: "群头像",
          align: "center",
          dataIndex: "icon",
          scopedSlots: { customRender: "icon" }
        },
        {
          title: "群组描述",
          align: "center",
          dataIndex: "descr",
          scopedSlots: { customRender: "templateContent" }
        },
        {
          title: "群组类型",
          align: "center",
          dataIndex: "publicGroup",
          customRender: function(text) {
            if (text === 0) {
              return "私有群";
            } else if (text === 1) {
              return "公开群";
            }
          }
        },
        {
          title: "加入群组需要审批",
          align: "center",
          dataIndex: "membersonly",
          customRender: function(text) {
            if (text === 0) {
              return "不需要";
            } else if (text === 1) {
              return "需要";
            }
          }
        },
        {
          title: "允许群成员邀请别人加入",
          align: "center",
          dataIndex: "allowinvites",
          customRender: function(text) {
            if (text === 0) {
              return "不允许";
            } else if (text === 1) {
              return "允许";
            }
          }
        },
        {
          title: "群最大成员数",
          align: "center",
          dataIndex: "maxusers"
        },
        {
          title: "现有成员总数",
          align: "center",
          dataIndex: "affiliationsCount"
        },
        {
          title: "邀请加群，被邀请人需要确认",
          align: "center",
          dataIndex: "inviteNeedConfirm",
          customRender: function(text) {
            if (text === 0) {
              return "不需要";
            } else if (text === 1) {
              return "需要";
            }
          }
        },
        {
          title: "管理员id",
          align: "center",
          dataIndex: "ownerId"
        },
        {
          title: "二维码",
          align: "center",
          dataIndex: "qrCode",
          scopedSlots: { customRender: "yqcode" }
        },
        {
          title: "全体禁言",
          align: "center",
          dataIndex: "bannedPost",
          customRender: function(text) {
            if (text === 0) {
              return "否";
            } else if (text === 1) {
              return "是";
            }
          }
        },
        {
          title: "阅后即焚",
          align: "center",
          dataIndex: "burnRead",
          customRender: function(text) {
            if (text === 0) {
              return "否";
            } else if (text === 1) {
              return "是";
            }
          }
        },
        {
          title: "公告",
          align: "center",
          dataIndex: "notice",
          scopedSlots: { customRender: "templateContent" }
        },
        {
          title: "操作",
          dataIndex: "state",
          align: "center",
          // width: 200,
          scopedSlots: { customRender: "action" }
        }
      ],
      url: {
        list: "/system/chatgroup/findPageList",
        freeze: "/system/chatgroup/forbidden/json",
        thaw: "/system/chatgroup/thaw/json"
      }
    };
  },

  methods: {
    getQueryParams() {
      //获取查询条件
      let sqp = {};
      if (this.superQueryParams) {
        sqp["superQueryParams"] = encodeURI(this.superQueryParams);
      }
      var param = Object.assign(
        sqp,
        this.queryParam,
        this.isorter,
        this.filters
      );
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      param.groupName = param.groupName ? param.groupName : "";

      param.groupType =
        param.groupType === 0 || param.groupType === 1 ? param.groupType : "";

      return filterObj(param);
    },

    //  打开成员列表页
    handleMembers(record) {
      this.$refs.modalForm.open(record);
    },
    handleFreeze(id) {
      let arr = `?groupId=${id}`;
      let that = this;
      postAction(this.url.freeze + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
          that.loadData();
        }
      });
    },
    handleThaw(id) {
      let arr1 = `?groupId=${id}`;
      let that = this;
      postAction(this.url.thaw + arr1).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
          that.loadData();
        }
      });
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>