<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="礼物名称">
              <a-input placeholder="请输入礼物名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="来源">
              <a-select placeholder="请选择礼物来源" v-model="queryParam.source">
                <a-select-option :value="1">直播</a-select-option>
                <a-select-option :value="2">游戏</a-select-option>
                <a-select-option :value="3">通用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="类型">
              <a-select placeholder="请选择礼物类型" v-model="queryParam.type">
                <a-select-option :value="1">普通场</a-select-option>
                <a-select-option :value="2">豪华场</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
            <a-col :md="4" :sm="4">
            <a-form-item label="等级">
              <a-select placeholder="请选择礼物等级" v-model="queryParam.level">
                <a-select-option :value="1">一级</a-select-option>
                <a-select-option :value="2">二级</a-select-option>
                <a-select-option :value="3">三级</a-select-option>
                <a-select-option :value="4">四级</a-select-option>
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
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
      </a-table>
    </div>
    <!-- 表单区域 -->
    <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <gift-modals ref="modalForm" @ok="modalFormOk"></gift-modals>
  </a-card>
</template>

<script>
// import ChartCard from "@/components/ChartCard";
import { postAction, deleteAction } from "@/api/manage";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import JEllipsis from "@/components/jeecg/JEllipsis";
import GiftModals from "./modules/GiftModals";
export default {
  name: "LiveGift",
  mixins: [JeecgListMixin],
  components: {
    ProductNewBigImg,
    JEllipsis,
    GiftModals,
    // ChartCard
  },

  data() {
    return {
      description: "直播间礼物列表",
      total: "",
      dataSource: [],
      columns: [
        {
          title: "礼物名称",
          align: "center",
          dataIndex: "name",
        },
        {
          title: "礼物图标",
          align: "center",
          dataIndex: "icon",
          scopedSlots: { customRender: "header" },
        },

        {
          title: "等级",
          align: "center",
          dataIndex: "level",
          customRender: function (text) {
            if (text == 1) {
              return "一级";
            } else if (text == 2) {
              return "二级";
            } else if (text == 3) {
              return "三级";
            } else if (text == 4) {
              return "四级";
            }
          },
        },
        {
          title: "类型",
          align: "center",
          dataIndex: "type",
          customRender: function (text) {
            if (text == 1) {
              return "普通场";
            } else if (text == 2) {
              return "豪华场";
            }
          },
        },
        {
          title: "来源",
          align: "center",
          dataIndex: "source",
          customRender: function (text) {
            if (text == 1) {
              return "直播";
            } else if (text == 2) {
              return "游戏";
            } else if (text == 3) {
              return "通用";
            }
          },
        },
        {
          title: "V币",
          align: "center",
          dataIndex: "money",
        },
        {
          title: "排序",
          align: "center",
          dataIndex: "sort",
        },
        {
          title: "是否使用",
          align: "center",
          dataIndex: "state",
          customRender: function (text) {
            if (text == 0) {
              return "是";
            } else if (text == 1) {
              return "否";
            }
          },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      url: {
        list: "/system/live/gift/list",
        delete: "/system/live/gift/delete",
      },
    };
  },
  methods: {
    handleDelete: function (record) {
      var id = record.id;
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!");
        return;
      }
      var that = this;
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },

    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
  },
};
</script>

<style scoped>
@import "~@assets/less/common.less";
.txt {
  height: 30px;
  width: 150px;
}
</style>
