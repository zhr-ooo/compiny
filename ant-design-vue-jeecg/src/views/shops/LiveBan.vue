<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="房间号">
              <a-input placeholder="请输入房间号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="用户名称">
              <a-input placeholder="请输入用户名称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="封禁级别">
              <a-select placeholder="请选择封禁级别" v-model="queryParam.level">
                <a-select-option value="A">A</a-select-option>
                <a-select-option value="B">B</a-select-option>
                <a-select-option value="C">C</a-select-option>
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
        <span slot="templateTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="10"></j-ellipsis>
        </span>
        <template slot="createTime" slot-scope="text, record">
          <span slot="createTime">{{ record.createTime | moment }}</span>
        </template>
      </a-table>
    </div>
    <!-- 表单区域 -->
    <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
import { postAction, deleteAction } from "@/api/manage";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import JEllipsis from "@/components/jeecg/JEllipsis";
export default {
  name: "LiveBan",
  mixins: [JeecgListMixin],
  components: {
    ProductNewBigImg,
    JEllipsis
  },

  data() {
    return {
      description: "直播间封禁",
      dataSource: [],
      columns: [
        {
          title: "用户名称",
          align: "center",
          dataIndex: "nickName"
        },
        {
          title: "房间号",
          align: "center",
          dataIndex: "code"
        },
        {
          title: "封禁原因",
          align: "center",
          dataIndex: "reason",
          scopedSlots: { customRender: "templateTitle" }
        },
        {
          title: "封禁级别",
          align: "center",
          dataIndex: "level"
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime",
          scopedSlots: { customRender: "createTime" }
        }
        // {
        //   title: "更新时间",
        //   align: "center",
        //   dataIndex: "modifyTime"
        // }
        // {
        //   title: "操作",
        //   dataIndex: "action",
        //   align: "center",
        //   scopedSlots: { customRender: "action" }
        // }
      ],
      url: {
        list: "/system/live/bannedRecord/list"
      }
    };
  },
  methods: {
    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
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
