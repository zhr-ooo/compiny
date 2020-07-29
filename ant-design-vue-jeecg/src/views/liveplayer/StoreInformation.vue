<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="5" :sm="5">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="商品编号">
              <a-input placeholder="请输入商品编号" v-model="queryParam.goodsNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="商品所属人">
              <a-input placeholder="请输入商品所属人" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :md="5" :sm="5">
            <a-form-item label="商品来源">
              <a-select placeholder="请选择商品来源" v-model="queryParam.source">
                <a-select-option :value="1">商城</a-select-option>
                <a-select-option :value="2">商家</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="商品状态" style="margin-left:20px">
              <a-select placeholder="请选择商品状态" v-model="queryParam.shelvesState">
                <a-select-option :value="0">下架</a-select-option>
                <a-select-option :value="1">上架</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="审核状态" style="margin-left:20px">
              <a-select placeholder="请选择审核状态" v-model="queryParam.state">
                <a-select-option :value="0">待审核</a-select-option>
                <a-select-option :value="1">已审核</a-select-option>
                <a-select-option :value="2">审核失败</a-select-option>
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
        <a-row style="padding-bottom:10px">
          <a-col :md="4" :sm="4">
            <a-button style="margin-left:20px" @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
        <span slot="action" slot-scope="text, record" @click.stop>
          <a @click.stop="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
            <a style="color: red">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click.stop="handleAduit(record)">审核</a>
          <a-divider type="vertical" />
          <a-popconfirm
            v-if="record.shelvesState === 0"
            title="确定上架吗?"
            @confirm="() => handleUp(record)"
          >
            <a>上架</a>
          </a-popconfirm>
          <a-popconfirm v-else title="确定下架吗?" @confirm="() => handleUp(record)">
            <a>下架</a>
          </a-popconfirm>
        </span>
        <span slot="templateTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="400"></j-ellipsis>
        </span>
        <template slot="avatar" slot-scope="text,record">
          <div style="width:100%;overflow:hidden;">
            <!-- <img v-for="(item,index) in text"
            :src="item"
            style="width:100px;height:100%;float:left;margin-left:10px"
            />-->
            <a-avatar
              v-for="(item,index) in text"
              shape="square"
              size="large"
              :src="item"
              :srcSet="item"
              @click.stop="bigImg(item)"
              style="float:left;margin-left:10px"
            ></a-avatar>
          </div>
        </template>
        <template slot="rebate" slot-scope="text, record">
          <span slot="rebate">{{ record.firstRebate}}%</span>
        </template>
        <template slot="rebateL" slot-scope="text, record">
          <span slot="rebateL">{{ record.secondRebate}}%</span>
        </template>
      </a-table>
    </div>
    <!-- 表单区域 -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <Information-modals ref="modalForm" @ok="modalFormOk"></Information-modals>
    <aduit-modal ref="changeModel" @ok="modalFormOk"></aduit-modal>
  </a-card>
</template>

<script>
import { postAction, deleteAction, putAction } from "@/api/manage";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { filterObj } from "@/utils/util";
import aduitModal from "./modules/aduitModal";
import JEllipsis from "@/components/jeecg/JEllipsis";
import InformationModals from "./modules/InformationModals";
export default {
  name: "ExpressCompany",
  mixins: [JeecgListMixin],
  components: {
    InformationModals,
    JEllipsis,
    ProductNewBigImg,
    aduitModal
  },

  data() {
    return {
      description: "商品信息列表",
      header: [],
      columns: [
        {
          title: "商品所属人",
          align: "center",
          dataIndex: "nickName"
        },
        {
          title: "商品名称",
          align: "center",
          dataIndex: "name",
          scopedSlots: { customRender: "templateTitle" },
          width: 250
        },
        {
          title: "商品价格",
          align: "center",
          dataIndex: "money"
        },
        {
          title: "商品图片",
          align: "center",
          dataIndex: "imageList",
          scopedSlots: { customRender: "avatar" },
          width: 200
        },
        {
          title: "商品来源",
          align: "center",
          dataIndex: "source",
          customRender: function(text) {
            if (text == 1) {
              return "商城";
            } else {
              return "商家";
            }
          }
        },
        {
          title: "商品编号",
          align: "center",
          dataIndex: "goodsNo"
        },
        {
          title: "库存",
          align: "center",
          dataIndex: "stock"
        },
        {
          title: "卖出商品数量",
          align: "center",
          dataIndex: "sellGoodsNum"
        },
        {
          title: "一级返佣",
          align: "center",
          dataIndex: "firstRebate",
          scopedSlots: { customRender: "rebate" }
        },
        {
          title: "二级返佣",
          align: "center",
          dataIndex: "secondRebate",
          scopedSlots: { customRender: "rebateL" }
        },
        {
          title: "商品状态",
          align: "center",
          dataIndex: "shelvesState",
          customRender: function(text) {
            if (text == 0) {
              return "下架";
            } else if (text == 1) {
              return "上架";
            }
          }
        },
        {
          title: "审核原因",
          align: "center",
          dataIndex: "reason",
          scopedSlots: { customRender: "templateTitle" },
          width: 150
        },
        {
          title: "审核状态",
          align: "center",
          dataIndex: "state",
          customRender: function(text) {
            if (text == 0) {
              return "待审核";
            } else if (text == 1) {
              return "已审核";
            } else if (text == 2) {
              return "审核失败";
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
        list: "/system/mall/goods/list",
        delete: "/system/mall/goods/delete",
        upAllow: "/system/mall/goods/upAndLowShelves"
      }
    };
  },

  methods: {
    handleMembersList(record) {
      this.$refs.modalForm.open(record);
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
    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
    handleUp: function(record) {
      console.log(record);
      let that = this;
      var roomId = record.id;
      var state = record.shelvesState;
      if (state === 0) {
        var en = 1;
        var arr = `?shelvesState=${en}&goodId=${roomId}`;
      } else if (state === 1) {
        var en = 0;
        var arr = `?shelvesState=${en}&goodId=${roomId}`;
      }
      putAction(this.url.upAllow + arr)
        .then(res => {
          if (res.success) {
            that.$message.success(res.message);
            that.$emit("ok");
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        })
        .finally(() => {
          that.confirmLoading = false;
        });
    },
    handleAduit: function(record) {
      console.log(record);
      this.$refs.changeModel.open(record);
      //   var arr = `?goodId=${record.id}`;
      //   var that = this;
      //   putAction(that.url.audit + arr).then(res => {
      //     if (res.success) {
      //       that.$message.success(res.message);
      //       that.loadData();
      //     } else {
      //       that.$message.warning(res.message);
      //     }
      //   });
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
