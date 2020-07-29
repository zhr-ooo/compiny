<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="举报人">
              <a-input placeholder="请输入用户名称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="房间号：">
              <a-input placeholder="请输入房间号" v-model="queryParam.roomId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="举报房间所属人">
              <a-input placeholder="请输入举报房间所属人" v-model="queryParam.reportRoomName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="处理状态">
              <a-select placeholder="请选择处理状态" v-model="queryParam.state">
                <a-select-option :value="0">待处理</a-select-option>
                <a-select-option :value="1">已处理</a-select-option>
              </a-select>
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

    <!-- 表格区域 -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="index"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="templateTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="10"></j-ellipsis>
        </span>
      </a-table>
    </div>
    <!-- 表单区域 -->

    <!-- <user-under-list ref="modalForm" @ok="modalFormOk"></user-under-list> -->
  </a-card>
</template>

<script>
import { JeecgListMixin } from "@/mixins/JeecgListMixin";

export default {
  name: "LiveReport",
  mixins: [JeecgListMixin],

  data() {
    return {
      description: "直播间举报列表",
      columns: [
        {
          title: "举报人",
          align: "center",
          dataIndex: "nickName"
        },
        {
          title: "举报房间所属人",
          align: "center",
          dataIndex: "reportRoomName"
        },
        {
          title: "房间号",
          align: "center",
          dataIndex: "code"
        },
        {
          title: "举报原因",
          align: "center",
          dataIndex: "reason"
        },
        {
          title: "处理状态",
          align: "center",
          dataIndex: "state",
          customRender: function(text) {
            if (text == 0) {
              return "待处理";
            } else if (text == 1) {
              return "已处理";
            }
          }
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime"
        }
      ],
      url: {
        list: "/system/live/report/list"
      }
    };
  },

  methods: {}
};
</script>

<style scoped>
@import "~@assets/less/common.less";
.txt {
  height: 30px;
  width: 150px;
}
</style>
