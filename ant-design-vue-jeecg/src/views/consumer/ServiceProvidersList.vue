<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="V云号">
              <a-input placeholder="请输入V云号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="3">
            <a-form-item label="身份">
              <a-select placeholder="请选择身份" v-model="queryParam.role">
                <!-- <a-select-option :value="0"></a-select-option> -->
                <a-select-option :value="1">创客达人</a-select-option>
                <a-select-option :value="2">大使服务商</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
             <a-col :md="4" :sm="4">
            <a-form-item label="月份">
              <a-month-picker
               
                v-model="queryParam.yearMonth"
                value-format="yyyy-MM"               
                @change="onDateChange"
                @ok="onDateOk"
              />
              <!-- <a-month-picker v-model="queryParam.month" format="YYYY-MM" placeholder="请选择月份" /> -->
               </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="分红资格">
              <a-select placeholder="请选择本月分红资格" v-model="queryParam.qualification">
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <span style="font-size: 16px;font-weight: bold;margin-right: 10px">本月达标人数:{{ total }}人</span>
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <!-- <a-button type="primary" @click="shareBonus" icon="strikethrough" style="margin-left: 8px">分红</a-button> -->
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
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <share-bonus-modal ref="modalForm" @ok="modalFormOk"></share-bonus-modal>
    <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
import { filterObj, formatDate } from "@/utils/util";
import ShareBonusModal from "./modules/ShareBonusModal";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import moment from 'moment'
export default {
  name: "ServiceProvidersList",
  mixins: [JeecgListMixin],
  components: {
    ShareBonusModal,
    ProductNewBigImg
  },
  data() {
    return {
      queryParam: {
        yearMonth: "",
        month:"",
        code: "",
        phone: "",
        qualification: "",
        role: ""
      },
      param: {
        yearMonth: "",
        month:"",
        code: "",
        phone: "",
        qualification: "",
        role: ""
      },
      total: "",
      description: "服务商列表页面",
      type: "ambassadorList",
      // 表头
      columns: [
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone"
        },
        {
          title: "V云号",
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
          title: "角色",
          align: "center",
          dataIndex: "userRoleName"
          // dataIndex: 'bigVip',
          // customRender: function (text, record) {
          //   if (text === 1) {
          //     return '大V会员'
          //   } else {
          //     if (record.isVip === 0) {
          //       return '普通会员'
          //     } else if (record.isVip === 1) {
          //       return '7天vip'
          //     } else if (record.isVip === 2) {
          //       return '月度vip'
          //     } else if (record.isVip === 3) {
          //       return '季度vip'
          //     } else if (record.isVip === 4) {
          //       return '年费vip'
          //     }
          //   }
          // }
        },
        {
          title: "V值",
          align: "center",
          dataIndex: "credits"
        }
      ],
      
      url: {
        list: "/system/appuserinfo/ambassadorList"
      }
    };
  },
  created() {
    const nowTime = new Date().getTime();
    const month = formatDate(nowTime, 'yyyy-MM');
    this.queryParam.yearMonth = moment(month, "yyyy-MM");
    this.queryParam.month = month;
  },
  methods: {
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return filterObj(param);
    },
    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
    // 分红
    shareBonus() {
      this.$refs.modalForm.open();
    },
    searchReset() {
      this.queryParam.code = "";
      this.queryParam.phone = "";
      this.queryParam.role = "";
      this.queryParam.qualification = "";
      this.queryParam.month = "";
      this.queryParam.yearMonth = "";
       this.queryParam.total = "";
      this.loadData(1);
    },
    onDateChange: function(value,dateString) {
    this.queryParam.month = dateString;
    },
    onDateOk(value) {
      // console.log(value)
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
