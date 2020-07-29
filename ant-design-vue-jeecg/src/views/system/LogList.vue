<template>
  <a-card :bordered="false">
    <!--导航区域-->
    <div>
      <a-tabs defaultActiveKey="0" @change="callback">
        <a-tab-pane tab="登录日志" key="0"></a-tab-pane>
        <a-tab-pane tab="操作日志" key="1"></a-tab-pane>
      </a-tabs>
    </div>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <!-- <a-col :md="6" :sm="8">
            <a-form-item label="搜索日志">
              <a-input placeholder="请输入搜索关键词" v-model="queryParam.keyWord"></a-input>
            </a-form-item>
          </a-col> -->

          <a-col :md="6" :sm="10">
            <a-form-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
          <a-col :md="5" :sm="8" v-if="tabKey === '1'">
            <a-form-item label="操作类型" style="left: 10px">
              <j-dict-select-tag v-model="queryParam.operType" placeholder="请选择操作类型" dictCode="operate_type"/>
            </a-form-item>
          </a-col>

          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24" >
              <a-button type="primary"  style="left: 10px" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary"  @click="searchReset" icon="reload" style="margin-left: 8px;left: 10px">重置</a-button>
            </a-col>
          </span>

        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <a-table
      ref="table"
      size="middle"
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange">

<!--      <div v-show="queryParam.logType==1" slot="expandedRowRender" slot-scope="record" style="margin: 0">-->
<!--        <div style="margin-bottom: 5px"><a-badge status="success" style="vertical-align: middle;"/><span style="vertical-align: middle;">请求方法:{{ record.method }}</span></div>-->
<!--        <div><a-badge status="processing" style="vertical-align: middle;"/><span style="vertical-align: middle;">请求参数:{{ record.requestParam }}</span></div>-->
<!--      </div>-->
      <!-- 字符串超长截取省略号显示-->
      <span slot="logContent" slot-scope="text">
        <j-ellipsis :value="text" :length="40"/>
      </span>
    </a-table>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
  import { filterObj, formatDate } from '@/utils/util';
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import moment from 'moment'

  export default {
    name: "LogList",
    mixins:[JeecgListMixin],
    components: {
      JEllipsis
    },
    data () {
      return {
        description: '日志管理页面',
        // 查询条件
        queryParam: {
          createTimeRange:[],
          logType:'0',
          begin: '',
          end: '',
          operType: ''
        },
        param: {
          createTimeRange:[],
          logType:'0',
          begin: '',
          end: '',
          operType: ''
        },
        tabKey: "0",
        // 表头
        columns: [
          {
            title: '日志内容',
            align:"left",
            dataIndex: 'log_content',
            scopedSlots: { customRender: 'logContent' },
            sorter: true
          },
          {
            title: '操作人ID',
            dataIndex: 'userid',
            align:"center",
            sorter: true
          },
          {
            title: '操作人名称',
            dataIndex: 'username',
            align:"center",
            sorter: true
          },
          {
            title: 'IP',
            dataIndex: 'ip',
            align:"center",
            sorter: true
          },
          {
            title: '耗时(毫秒)',
            dataIndex: 'cost_time',
            align:"center",
            sorter: true
          },
          {
            title: '操作时间',
            dataIndex: 'create_time',
            align:"center",
            sorter: true,
            customRender: function (text) {
              if (text) {
                return formatDate(text, 'yyyy-MM-dd hh:mm:ss')
              }
            }
          },
          {
            title: '操作用户',
            dataIndex: 'create_by',
            align:"center",
            customRender: function(text) {
              if (text === 'vyunAPP') {
                return 'app用户'
              } else if (text === 'vyunJob') {
                return '定时任务'
              } else {
                return '后台管理用户'
              }
            }
          }
        ],
        operateColumn:[
          {
            title: '访问URL',
            dataIndex: 'request_url',
            align: 'center',
            scopedSlots: { customRender: 'logContent' },
          },
          {
            title: '操作类型',
            dataIndex: 'operate_type',
            align:"center",
            customRender: function(text) {
              if (text === 1) {
                return '查询'
              } else if (text === 2) {
                return '添加'
              } else if (text === 3) {
                return '修改'
              } else if (text === 4) {
                return '删除'
              } else if (text === 5) {
                return '导入'
              } else if (text === 6) {
                return '导出'
              } else {
                return text
              }
            }
          },
        ],
        labelCol: {
          xs: { span: 1 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 10 },
          sm: { span: 16 },
        },
        url: {
          list: "/sys/log/list",
        },
      }
    },
    created() {
      const nowTime = new Date().getTime();
      const end = formatDate(nowTime, 'yyyy-MM-dd');
      const begin = formatDate(nowTime - 24*60*60*1000, 'yyyy-MM-dd');
      this.queryParam.createTimeRange = [moment(begin, 'YYYY-MM-DD'), moment(end, 'YYYY-MM-DD')];
      this.queryParam.begin = begin;
      this.queryParam.end = end;
    },
    methods: {
      getQueryParams(){
        console.log(this.queryParam.createTimeRange)
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTimeRange; // 时间参数不传递后台
        return filterObj(param);
      },

      // 重置
      searchReset(){
        var that = this;
        var logType = that.queryParam.logType;
        that.queryParam = that.param; //清空查询区域参数
        that.queryParam.logType = logType;
        that.queryParam.operType = '';
        that.loadData(this.ipagination.current);
      },
      // 日志类型
      callback(key){
        // 动态添加操作类型列
        if (key === '1') {
          this.tabKey = '1';
          let cols = this.columns.concat(this.operateColumn);
          this.columns = cols;
        }else {
          this.tabKey = key;
          this.columns.splice(7,2);
        }

        let that=this;
        that.queryParam.logType=key;
        that.loadData();
      },
      onDateChange: function (value, dateString) {
        console.log(dateString[0],dateString[1]);
        this.queryParam.begin=dateString[0];
        this.queryParam.end=dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>