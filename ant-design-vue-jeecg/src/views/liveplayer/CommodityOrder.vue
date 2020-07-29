<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="收货人姓名">
              <a-input placeholder="请输入收货人姓名" v-model="queryParam.consigneeName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="4">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.consigneePhone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.goodsName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="商品来源">
              <a-select placeholder="请输入商品来源" v-model="queryParam.source">
                <a-select-option :value="1">商城</a-select-option>
                <a-select-option :value="2">商家</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="支付方式">
              <a-select placeholder="请输入支付方式" v-model="queryParam.payMode">
                <a-select-option :value="1">支付宝</a-select-option>
                <a-select-option :value="2">微信</a-select-option>
                <a-select-option :value="3">V币</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="订单状态">
              <a-select placeholder="请输入订单状态" v-model="queryParam.state">
                <a-select-option :value="0">已取消</a-select-option>
                <a-select-option :value="1">待支付</a-select-option>
                <a-select-option :value="2">已支付</a-select-option>
                <a-select-option :value="3">已发货</a-select-option>
                <a-select-option :value="4">已签收</a-select-option>
                <a-select-option :value="5">已完成</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="订单编号">
              <a-input placeholder="请输入订单编号" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="卖家">
              <a-input placeholder="请输入卖家" v-model="queryParam.sellerName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="订单时间">
              <a-range-picker
                v-model="queryParam.createTimeRange"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="用户标识">
              <a-select placeholder="请选择用户标识" v-model="queryParam.marker">
                <a-select-option value="0">测试</a-select-option>
                <a-select-option value="1">正式</a-select-option>
                <a-select-option value="2">官方</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="4" :sm="4">
            <a-form-item label="用户id">
              <a-input placeholder="请输入用户id" v-model="queryParam.userId"></a-input>
            </a-form-item>
          </a-col>-->
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
              <a-button
                type="primary"
                icon="to-top"
                @click="exportExcel"
                style="margin-left: 8px"
              >导出</a-button>
            </span>
          </a-col>
        </a-row>
        <a-row style="height:120px">
          <a-col :sm="6" :md="6" :xl="6" :style="{ height:'50px',border:'1px solid gary' }">
            <chart-card
              :bordered="true"
              :loading="loading"
              :title="this.store+this.state"
              :total="goodsOrderCount.toString()"
            ></chart-card>
          </a-col>

          <!-- <a-col :sm="6" :md="6" :xl="6" :style="{ height:'50px',border:'1px solid gary' }">
            <chart-card
              :loading="loading"
              :title="this.storeMon+this.state"
              :total="this.goodsOrderMoney.toString()"
            ></chart-card>
          </a-col>-->
          <a-col :sm="6" :md="6" :xl="6" :style="{ height:'50px',border:'1px solid gary' }">
            <chart-card
              :loading="loading"
              :title="this.storeZon+this.state"
              :total="this.goodOrderTotalMoney.toString()"
            ></chart-card>
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
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :customRow="clickThenCheck"
      >
        <span slot="action" slot-scope="text, record" @click.stop>
          <a @click.stop="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click.stop="handleDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a v-if="record.state === 0 || record.state === 1 || record.state === 5"></a>
          <a v-else>
            <a-popconfirm title="确定退款吗?" @confirm="() => handleTui(record)">
              <a>退款</a>
            </a-popconfirm>
          </a>
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

    <Order-modals ref="modalForm" @ok="modalFormOk"></Order-modals>
    <Order-detail ref="modalForm1" @ok="modalFormOk"></Order-detail>
  </a-card>
</template>

<script>
import { filterObj, formatDate } from "@/utils/util";
import { postAction, getAction, putAction } from "@/api/manage";
import ChartCard from "@/components/ChartCard";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import OrderDetail from "./modules/OrderDetail";
import JEllipsis from "@/components/jeecg/JEllipsis";
import OrderModals from "./modules/OrderModals";
import moment from "moment";
export default {
  name: "CommodityOrder",
  mixins: [JeecgListMixin],
  components: {
    OrderModals,
    OrderDetail,
    JEllipsis,
    ChartCard,
  },

  data() {
    return {
      description: "商品订单列表",
      goodOrderTotalMoney: 0,
      goodsOrderCount: 0, //商品订单数量
      // goodsOrderMoney: 0,
      store: "",
      storeMon: "",
      storeZon: "",
      state: "",
      queryParam: {
        createTimeRange: [],
        logType: "0",
        beginTime: "",
        endTime: "",
        operType: "",
      },
      param: {
        createTimeRange: [],
        logType: "0",
        beginTime: "",
        endTime: "",
        operType: "",
      },
      columns: [
        {
          title: "卖家",
          align: "center",
          dataIndex: "sellerName",
        },
        {
          title: "收货人姓名",
          align: "center",
          dataIndex: "consigneeName",
          width:80
        },
        {
          title: "收货人手机号",
          align: "center",
          dataIndex: "consigneePhone",
        },
        {
          title: "收货人地址",
          align: "center",
          dataIndex: "consigneeAddress",
          scopedSlots: { customRender: "templateTitle" },
          width:100
        },
        // {
        //   title: "订单编号",
        //   align: "center",
        //   dataIndex: "orderNo",
        //   scopedSlots: { customRender: "templateTitle" },
        // },
        {
          title: "快递公司",
          align: "center",
          dataIndex: "courierCompany",
        },
        {
          title: "快递单号",
          align: "center",
          dataIndex: "courierNo",
          scopedSlots: { customRender: "templateTitle" },
        },
        {
          title: "商品名称",
          align: "center",
          dataIndex: "goodsName",
        },
        {
          title: "购买商品数量",
          align: "center",
          dataIndex: "goodsNum",
        },
        {
          title: "购买商品单价",
          align: "center",
          dataIndex: "money",
        },
        {
          title: "购买商品总价",
          align: "center",
          dataIndex: "totalMoney",
        },

        {
          title: "购买时真实支付金额",
          align: "center",
          dataIndex: "payMoney",
          width:100
        },

        {
          title: "商品来源",
          align: "center",
          dataIndex: "source",
          customRender: function (text) {
            if (text == 1) {
              return "商城";
            } else if (text == 2) {
              return "商家";
            }
          },
        },
        {
          title: "订单状态",
          align: "center",
          dataIndex: "state",
          customRender: function (text) {
            if (text == 0) {
              return "已取消";
            } else if (text == 1) {
              return "待支付";
            } else if (text == 2) {
              return "已支付";
            } else if (text == 3) {
              return "已发货";
            } else if (text == 4) {
              return "已签收";
            } else if (text == 5) {
              return "已完成";
            }
          },
        },
        {
          title: "支付方式",
          align: "center",
          dataIndex: "payMode",
          customRender: function (text) {
            if (text == 1) {
              return "支付宝";
            } else if (text == 2) {
              return "微信";
            } else if (text == 3) {
              return "V币";
            }
          },
        },
        // {
        //   title: "交易编号",
        //   align: "center",
        //   dataIndex: "tradeNo",
        //   scopedSlots: { customRender: "templateTitle" },
        // },
        {
          title: "备注",
          align: "center",
          dataIndex: "remark",
          scopedSlots: { customRender: "templateTitle" },
          width:100
        },
        {
          title: "用户标识",
          align: "center",
          dataIndex: "marker",
          customRender: function (text) {
            if (text == 0) {
              return "测试";
            } else if (text == 1) {
              return "正式";
            } else if (text == 2) {
              return "官方";
            }
          },
        },
        {
          title: "创建时间",
          align: "center",
          dataIndex: "createTime",
          scopedSlots: { customRender: "createTime" },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
          width: 200,
        },
      ],
      url: {
        list: "/system/mall/order/list",
        edit: "/system/mall/order/detail",
        excel: "/system/mall/order/exportExcel",
        refund: "/system/mall/order/refund", //退货
      },
    };
  },
  created() {
    // const nowTime = new Date().getTime();
    // const endTime = formatDate(nowTime, "yyyy-MM-dd");
    // const beginTime = formatDate(nowTime - 24 * 60 * 60 * 1000, "yyyy-MM-dd");
    // this.queryParam.createTimeRange = [
    //   moment(beginTime, "YYYY-MM-DD"),
    //   moment(endTime, "YYYY-MM-DD")
    // ];
    // this.queryParam.beginTime = beginTime + " 00:00:00";
    // this.queryParam.endTime = endTime + " 00:00:00";
    this.loadData(1);
  },
  methods: {
    handleMembersList(record) {
      this.$refs.modalForm.open(record);
    },
    handleTui(record) {
      var that = this;
      console.log(record);
      putAction(this.url.refund, { id: record.id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
        } else {
          that.$message.warning(res.message);
        }
        that.loadData();
      });
    },
    clickThenCheck(record) {
      return {
        on: {
          click: () => {
            this.$refs.modalForm1.edit(record);
            this.$refs.modalForm1.title = "详情";
            this.$refs.modalForm1.disableSubmit = true;
          },
        },
      };
    },
    handleDetail: function (record) {
      this.$refs.modalForm1.edit(record);
      this.$refs.modalForm1.title = "详情";
      this.$refs.modalForm1.disableSubmit = true;
    },
    getQueryParams() {
      console.log(this.queryParam.createTimeRange);
      var param = Object.assign({}, this.queryParam, this.isorter);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      param.createTimeRange = this.createTimeRange;
      param.beginTime = this.queryParam.beginTime;
      param.endTime = this.queryParam.endTime;
      return filterObj(param);
    },
    onDateChange: function (value, dateString) {
      console.log(dateString[0], dateString[1]);
      this.queryParam.beginTime = dateString[0] + " 00:00:00";
      this.queryParam.endTime = dateString[1] + " 00:00:00";
    },
    onDateOk(value) {
      console.log(value);
    },
    exportExcel: function () {
      var that = this;
      var params = this.getQueryParams();
      var url = "";
      if (params.consigneeName != undefined) {
        if (url == "") {
          url = "consigneeName=" + params.consigneeName;
        } else {
          url = "&consigneeName=" + params.consigneeName;
        }
      }
      if (params.consigneePhone != undefined) {
        if (url == "") {
          url += "consigneePhone=" + params.consigneePhone;
        } else {
          url += "&consigneePhone=" + params.consigneePhone;
        }
      }
      if (params.goodsName != undefined) {
        if (url == "") {
          url += "goodsName=" + params.goodsName;
        } else {
          url += "&goodsName=" + params.goodsName;
        }
      }
      if (params.source != undefined) {
        console.log(url);
        if (url == "") {
          url += "source=" + params.source;
        } else {
          url += "&source=" + params.source;
        }
      }
      if (params.payMode != undefined) {
        if (url == "") {
          url += "payMode=" + params.payMode;
        } else {
          url += "&payMode=" + params.payMode;
        }
      }
      if (params.state != undefined) {
        if (url == "") {
          url += "state=" + params.state;
        } else {
          url += "&state=" + params.state;
        }
      }
      if (params.orderNo != undefined) {
        if (url == "") {
          url += "orderNo=" + params.orderNo;
        } else {
          url += "&orderNo=" + params.orderNo;
        }
      }
      window.location.href = "/vyun/system/mall/order/exportExcel?" + url;
      console.log(url);
      // getAction(this.url.excel, params)
      //   .then(res => {
      //     console.log(res)
      //     if (res.success) {
      //       that.$message.success(res.message);
      //       that.$emit("ok");
      //     } else {
      //       that.$message.warning(res.message);
      //     }
      //   })
      //   .finally(() => {
      //     that.confirmLoading = false;

      //   });
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error("请设置url.list属性!");
        return;
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams(); //查询条件
      this.loading = true;

      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          console.log(res);
          this.dataSource = res.result.pageList.records;
          this.ipagination.total = res.result.pageList.total;
          this.total = res.result.pageList.total;
          this.goodOrderTotalMoney = res.result.goodOrderTotalMoney;
          this.goodsOrderCount = res.result.goodsOrderCount;
          // this.goodsOrderMoney = res.result.goodsOrderMoney;
          this.state = res.result.state;
          // var statename = '';
          if (this.state == null) {
            this.state = "";
            this.store = "卖出商品订单数量";
            this.storeMon = "卖出商品订单单价";
            this.storeZon = "卖出商品订单总金额";
          } else {
            console.log(this.state);
            if (this.state == 2) {
              this.state = "(已支付)";
              this.store = "商品订单数量";
              this.storeMon = "商品订单单价";
              this.storeZon = "商品订单总金额";
            } else if (this.state == 3) {
              this.state = "(已发货)";
              this.store = "商品订单数量";
              this.storeMon = "商品订单单价";
              this.storeZon = "商品订单总金额";
            } else if (this.state == 4) {
              this.state = "(已签收)";
              this.store = "商品订单数量";
              this.storeMon = "商品订单单价";
              this.storeZon = "商品订单总金额";
            } else if (this.state == 5) {
              this.state = "(已完成)";
              this.store = "商品订单管理";
              this.storeMon = "商品订单单价";
              this.storeZon = "商品订单总金额";
            } else if (this.state == 0) {
              this.state = "(已取消)";
              this.store = "商品订单数量";
              this.storeMon = "商品订单单价";
              this.storeZon = "商品订单总金额";
            } else if (this.state == 1) {
              this.state = "(待支付)";
              this.store = "商品订单数量";
              this.storeMon = "商品订单单价";
              this.storeZon = "商品订单总金额";
            }
          }
          console.log(this.store);
        }
        if (res.code === 510) {
          this.$message.warning(res.message);
        }
        this.loading = false;
      });
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
