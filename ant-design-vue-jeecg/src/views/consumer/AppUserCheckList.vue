<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
              <a-col :md="4" :sm="4">
            <a-form-item label="真实姓名">
              <a-input placeholder="请输入真实姓名" v-model="queryParam.realName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select placeholder="请选择申请状态" v-model="queryParam.checkType">
                <a-select-option :value="1">申请中</a-select-option>
                <a-select-option :value="2">申请成功</a-select-option>
                <a-select-option :value="3">申请失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
        @change="handleTableChange">
        <template slot="card" slot-scope="text">
          <img :src="text" style="width: 100px;height: 100px;" @click="bigImg(text)" />
        </template>
        <span slot="templateAddress" slot-scope="text">
          <j-ellipsis :value="text" :length="10"></j-ellipsis>
        </span>
        <span slot="templateFailreason" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>

        <span slot="action" slot-scope="text, record" v-if="record.status === 1">
          <a-popconfirm title="确定通过审核吗?" @confirm="() => okCheck(record.userid)">
            <a>通过</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="falseCheck(record.userid)">拒绝</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <appUserCheck-modal ref="modalForm" @ok="modalFormOk"></appUserCheck-modal>
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <app-user-check-audit-modal ref="auditModel" @ok="modalFormOk"></app-user-check-audit-modal>
  </a-card>
</template>

<script>
  import AppUserCheckModal from './modules/AppUserCheckModal'
  import ProductNewBigImg from "../product/modules/ProductNewBigImg";
  import AppUserCheckAuditModal from "./modules/AppUserCheckAuditModal";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from "@api/manage";
  import { filterObj } from "@/utils/util";
  import JEllipsis from "@/components/jeecg/JEllipsis";

  export default {
    name: "AppUserCheckList",
    mixins:[JeecgListMixin],
    components: {
      JEllipsis,
      AppUserCheckModal,
      ProductNewBigImg,
      AppUserCheckAuditModal
    },
    data () {
      return {
        description: '实名认证审核',
        // 表头
        columns: [
          {
            title: '真实姓名',
            align:"center",
            dataIndex: 'realname'
           },
          {
            title: '手机号码',
            align: 'center',
            dataIndex: 'telNumber'
          },
          {
            title: '身份证号码',
            align:"center",
            dataIndex: 'idcard'
           },
          {
            title: '手持身份证图片',
            align:"center",
            dataIndex: 'idcardimage',
            scopedSlots: { customRender: 'card' }
           },
          {
            title: '身份证正面照片',
            align:"center",
            dataIndex: 'idcardfrontimage',
            scopedSlots: { customRender: 'card' }
           },
          {
            title: '身份证反面照片',
            align:"center",
            dataIndex: 'idcardbackimage',
            scopedSlots: { customRender: 'card' }
           },
          {
            title: '状态',
            align:"center",
            dataIndex: 'status',
            customRender: function(text) {
              if (text === 1) {
                return '申请中'
              } else if (text === 2) {
                return '申请成功'
              } else if (text === 3) {
                return '申请失败'
              }
            }
           },
          {
            title: '申请时间',
            align:"center",
            dataIndex: 'createtime'
           },
          {
            title: '审核时间',
            align:"center",
            dataIndex: 'checktime'
           },
          {
            title: '现居地址',
            align:"center",
            dataIndex: 'address',
            scopedSlots: { customRender: 'templateAddress' }
           },
          {
            title: '审核失败原因',
            align:"center",
            dataIndex: 'failreason',
            scopedSlots: { customRender: 'templateFailreason' }
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/user/appusercheck/findCheckList",
          delete: "/user/appUserCheck/delete",
          auditTrue: '/user/appusercheck/auditTrue'
       },
    }
  },
    methods: {
      //  图片点击放大
      bigImg (text) {
        if(text) {
          this.$refs.bigImg.make(text);
          this.$refs.bigImg.width = 600;
        }
      },
    //  申请通过
      okCheck (userid) {
        const formData = {
          id: userid
        };
        getAction(this.url.auditTrue, formData).then(res => {
          if (res.success) {
            this.$message.success(res.message);
            this.loadData()
          } else {
            this.$message.success(res.message);
          }
        }).catch(err => {
          this.$message.success(err.message);
        })
      },
    //  审核拒绝
      falseCheck (userid) {
        this.$refs.auditModel.open(userid);
      },
      getQueryParams() {
        //获取查询条件
        let sqp = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.checkType = param.checkType ? param.checkType : '';
        param.realName = param.realName ? param.realName : '';
        return filterObj(param);
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>