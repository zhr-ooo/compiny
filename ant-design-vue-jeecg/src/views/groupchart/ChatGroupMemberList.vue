<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="5" :sm="8">
            <a-form-item label="是否禁言">
              <a-select placeholder="请选择" v-model="queryParam.bp">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="角色">
              <a-select placeholder="请选择" v-model="queryParam.role">
                <a-select-option :value="1">群主</a-select-option>
                <a-select-option :value="2">管理员</a-select-option>
                <a-select-option :value="3">普通成员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="环信id">
              <a-input placeholder="请填写环信id" v-model="queryParam.huanxinId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="V云号">
              <a-input placeholder="请填写V云号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8" >
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
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import { filterObj } from "@/utils/util";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "ChatGroupMemberList",
    mixins:[JeecgListMixin],
    components: {},
    data () {
      return {
        description: '群组成员表管理页面',
        // 表头
        columns: [
          {
            title: '用户V云id',
            align:"center",
            dataIndex: 'code'
           },
          {
            title: '用户环信id',
            align:"center",
            dataIndex: 'easemobId'
           },
          {
            title: '角色',
            align:"center",
            dataIndex: 'role',
            customRender: function(text) {
              if (text === 1) {
                return '群主'
              } else if (text === 2) {
                return '管理员'
              } else if (text === 3) {
                return '普通成员'
              }
            }
           },
          {
            title: '进入时间',
            align:"center",
            dataIndex: 'createTime'
           },
          {
            title: '是否禁言',
            align:"center",
            dataIndex: 'bannedPost',
            customRender: function(text) {
              if (text === 0) {
                return '否'
              } else if (text === 1) {
                return '是'
              }
            }
           }
        ],
        url: {
          list: "/system/chatgroupMember/memberList"
        }
    }
  },
    methods: {
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
        param.groupId = this.$route.query.id;
        param.bp = (param.bp === 0 || param.bp === 1) ? param.bp : '';
        param.role = param.role ? param.role : '';
        param.code = param.code ? param.code : '';
        param.huanxinId = param.huanxinId ? param.huanxinId : '';
        return filterObj(param);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>