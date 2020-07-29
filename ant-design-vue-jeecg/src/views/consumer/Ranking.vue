<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="26">
          <a-col :md="8" :sm="10">
            <a-form-item label="创建时间">
              <a-range-picker
                style="width: 210px"
                v-model="queryParam.createTimeRange"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" style="left: 10px" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px;left: 10px"
              >重置</a-button>
            </a-col>
          </span>
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
        rowKey="userId"
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
      </a-table>
    </div>
    <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
import { filterObj, formatDate } from "@/utils/util";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
// import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import moment from "moment";
import { getAction } from "@/api/manage";
export default {
  name: "Ranking",
  // mixins: [JeecgListMixin],
  components: {
    ProductNewBigImg
  },
  data() {
    return {
      dataSource: [],
      loading: false,
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30"],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条";
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      description: "排行榜",
      queryParam: {
        createTimeRange: [],
        logType: "0",
        beginTime: "",
        endTime: "",
        operType: ""
      },
      param: {
        createTimeRange: [],
        logType: "0",
        beginTime: "",
        endTime: "",
        operType: ""
      },
      columns: [
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "v云号",
          align: "center",
          dataIndex: "code"
        },
        {
          title: "昵称",
          align: "center",
          dataIndex: "nickName"
        },
        {
          title: "头像",
          align: "center",
          dataIndex: "header",
          scopedSlots: { customRender: "header" }
        },
        {
          title: "会员级别",
          align: "center",
          dataIndex: "isVip",
          customRender: function(text) {
            if (text == "0") {
              return "普通会员";
            } else if (text == "1") {
              return "3天体验期";
            } else if (text == "4") {
              return "年费";
            } else if (text == "5") {
              return "半年费";
            }
          }
        },
        {
          title: "创客达人",
          align: "center",
          dataIndex: "isCreator",
          customRender: function(text) {
            if (text == 1) {
              return "是";
            } else {
              return "否";
            }
          }
        },
        {
          title: "v云大使",
          align: "center",
          dataIndex: "ambassador",
          customRender: function(text) {
            if (text == 1) {
              return "是";
            } else {
              return "否";
            }
          }
        },

        {
          title: "V值",
          align: "center",
          dataIndex: "credits"
        }
      ],
      url: {
        list: "/system/ranking/list"
      }
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
    searchQuery() {
      this.loadData(1);
    },
    searchReset() {
      this.queryParam = this.param || {};
      this.loadData(1);
    },
    loadData(arg) {
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams(); //查询条件
      this.loading = true;

      getAction(this.url.list, params).then(res => {
        if (res.success) {
          this.state = res.result.records.state;
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;

          console.log(res);
        }
        if (res.code === 510) {
          this.$message.warning(res.message);
        }
        this.loading = false;
      });
    },
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
    getQueryField() {
      //TODO 字段权限控制
      var str = "id,";
      this.columns.forEach(function(value) {
        str += "," + value.dataIndex;
      });
      return str;
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
    searchReset() {
      var that = this;
      var logType = that.queryParam.logType;
      that.queryParam = {}; //清空查询区域参数
      that.queryParam.logType = logType;
      that.queryParam.operType = "";
      that.loadData(this.ipagination.current);
    },
    onDateChange: function(value, dateString) {
      console.log(dateString[0], dateString[1]);
      this.queryParam.beginTime = dateString[0] + " 00:00:00";
      this.queryParam.endTime = dateString[1] + " 00:00:00";
    },
    onDateOk(value) {
      console.log(value);
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc";
      }
      this.ipagination = pagination;
      this.loadData();
    }
  }
};
</script>

<style>
</style>