<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="直播标题">
              <a-input placeholder="请输入直播标题" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="用户名称">
              <a-input placeholder="请输入用户名称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="房间号">
              <a-input placeholder="请输入房间号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="直播间状态">
              <a-select placeholder="请选择直播间状态" v-model="queryParam.state">
                <a-select-option :value="0">关闭</a-select-option>
                <a-select-option :value="1">开启</a-select-option>
                <a-select-option :value="2">封禁</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="开通商户">
              <a-select placeholder="请选择是否开通商户" v-model="queryParam.merchant">
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
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
        <span slot="action" slot-scope="text, record" @click.stop style="position:relative">
          <!-- <a-popconfirm
            v-if="record.state === 2"
            title="确定封禁吗?"
            @confirm="() => handleFen(record)"
          >-->
          <a v-if="record.state === 1" @click.stop="handleBanRoom(record)">封禁</a>
          <a v-else-if="record.state === 0"></a>
          <a-popconfirm v-else title="确定解封吗?" @confirm="() => handleBreak(record)">
            <a>解封</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a v-if="record.merchant === 0">
            <a-popconfirm title="确定开通商户吗?" @confirm="() => handleMerchant(record)">
              <a>开通商户</a>
            </a-popconfirm>
          </a>
          <a v-else></a>

          <a v-if="record.state === 1" style="margin-left:5px">
            <a-popconfirm title="确定关闭直播间吗?" @confirm="() => handleClose(record)">
              <a>关闭</a>
            </a-popconfirm>
          </a>
          <a v-else></a>
        </span>
        <span slot="templateTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="10"></j-ellipsis>
        </span>
        <div slot="templateStream" slot-scope="text, record">
          <!-- <a :href="text">{{text}}</a> -->
          <a style="width:100px;height:80px;margin:auto;display:block;" @click="click(record)">
            <img :src="text" alt style="width:100%;height:100%" />
          </a>
        </div>
      </a-table>
    </div>
    <!-- 表单区域 -->
    <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <forbidden-room ref="modalForm" @ok="modalFormOk"></forbidden-room>
  </a-card>
</template>

<script>
import { postAction, putAction } from "@/api/manage";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import ForbiddenRoom from "./modules/ForbiddenRoom";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";

import JEllipsis from "@/components/jeecg/JEllipsis";
export default {
  name: "LiveRoom",
  mixins: [JeecgListMixin],
  components: {
    ProductNewBigImg,
    ForbiddenRoom,
    JEllipsis
  },

  data() {
    return {
      description: "直播房间记录管理",
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
          title: "推流地址",
          align: "center",
          dataIndex: "coverImg",
          scopedSlots: { customRender: "templateStream" }
        },
        {
          title: "展示图",
          align: "center",
          dataIndex: "showImg",
          scopedSlots: { customRender: "header" }
        },
        {
          title: "直播标题",
          align: "center",
          dataIndex: "title"
        },
        {
          title: "屏蔽词",
          align: "center",
          dataIndex: "blockWord"
        },
        {
          title: "开通商户",
          align: "center",
          dataIndex: "merchant",
          customRender: function(text) {
            if (text === 0) {
              return "否";
            } else if (text === 1) {
              return "是";
            }
          }
        },
        {
          title: "直播间状态",
          align: "center",
          dataIndex: "state",
          customRender: function(text) {
            if (text === 0) {
              return "关闭";
            } else if (text === 1) {
              return "开启";
            } else if (text === 2) {
              return "封禁";
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
        list: "/system/live/room/list",
        update: "/system/live/room/updateStatus",
        brea: "/system/live/room/unseal",
        Merchant: "/system/live/room/openMerchant",
        closedid: "/system/live/room/closed"
      }
    };
  },

  methods: {
    //  封禁直播间
    handleBreak: function(record) {
      console.log(record);
      let that = this;
      var roomId = record.id;
      var state = record.state;
      if (state === 2) {
        var en = 0;
        var arr = `?state=${en}&roomId=${roomId}&code=${record.code}`;
      } else {
        var en = 0;
        var arr = `?state=${en}&roomId=${roomId}&code=${record.code}`;
      }
      putAction(this.url.brea + arr)
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
    handleMerchant: function(record) {
      var that = this;
      var chartId = record.id;
      var fromDarr = `?id=${chartId}`;
      postAction(this.url.Merchant + fromDarr)
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
    handleClose: function(record) {
      var that = this;
      var chartId = record.id;
      var fromDarr = `?id=${chartId}&code=${record.code}`;
      postAction(this.url.closedid + fromDarr)
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
    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
    handleBanRoom(record) {
      this.$refs.modalForm.open(record);
      this.$refs.modalForm.title = "封禁房间";
    },
    click(record) {
      console.log(record);
      let that = this;
      if (record.state != 1) {
        alert("当前直播已关闭，请查看其他直播吧~");
      } else {
        //       window.open(
        //   "http://192.168.110.29:5501/liveplayer/lxPc.html?flv=" + record.streamAddrUrl
        // );
        window.open(
          "http://vyun.dujialive.com/liveplayer/lxPc.html?flv=" +
            record.streamAddrUrl
        );
      }

      // window.location.href = "http://127.0.0.1:5501/liveplayer/lx1.html?flv="+record.streamAddrUrl
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
