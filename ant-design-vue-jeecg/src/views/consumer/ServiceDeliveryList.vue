<template>
  <a-card :bordered="false">
    
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="12" :sm="12">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
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
        <span slot="header" slot-scope="text">
          <a-avatar shape="square" size="large" :src="text" :srcSet="text" @click.stop="bigImg(text)"></a-avatar>
        </span>
        <span slot="templateAddress" slot-scope="text">
          <j-ellipsis :value="text" :length="30"></j-ellipsis>
        </span>
      
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import { postAction } from "@/api/manage";
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";

  export default {
    name: "ServiceDeliveryList",
    mixins: [JeecgListMixin],
    components: {
      JEllipsis
    },
    data() {
      return {
        description: '服务商邮寄列表页面',
        // 表头
        columns: [
          {
            title: '用户昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '手机号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '订单编号',
            align: "center",
            dataIndex: 'code'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '支付时间',
            align: "center",
            dataIndex: 'payTime'
          },
          {
            title: '收件人',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '收件人电话',
            align: "center",
            dataIndex: 'userPhone'
          },
          {
            title: '详细地址',
            align: "center",
            dataIndex: 'address',
            scopedSlots: { customRender: 'templateAddress' }
          }
        ],
        url: {
          list: "/system/ambassadororder/pageList"
        }
      }
    },
    methods: {
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        postAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
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
        param.phone = param.phone ? param.phone: '';
        let formData = `field=${param.field}&pageNo=${param.pageNo}&pageSize=${param.pageSize}&phone=${param.phone}`
        return formData;
      },
      //  图片点击放大
      bigImg(text) {
        if (text) {
          this.$refs.bigImg.make(text);
        }
      },
      //  修改角色
      handelRole(record) {
        this.$refs.roleModel.open(record);
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
