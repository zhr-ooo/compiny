<template>
  <a-card :bordered="false">
    
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          
          <a-col :md="6" :sm="8">
            <a-form-item label="课程标题">
              <a-input placeholder="请输入课程标题" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="课程分类">
              <a-select placeholder="请选择课程分类" v-model="queryParam.category">
                <a-select-option v-for="(item, index) in selectList" :key="index" :value="item.id">{{ item.name }}</a-select-option>
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
        @change="handleTableChange"
        :customRow="clickThenCheck">

        <span slot="avatar" slot-scope="text">
          <a-avatar shape="square" size="large" :src="text" :srcSet="text" @click.stop="bigImg(text)"></a-avatar>
        </span>
        <span slot="templateTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="10"></j-ellipsis>
        </span>
        <span slot="templateContent" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>
        
        <span slot="action" slot-scope="text, record" @click.stop>
          <!-- 非会员显示详情 -->
          <a href="javascript:;" @click.stop="handleDetail(record)">详情</a>

          <a-divider type="vertical" v-if="record.auditstate === 1" />
          <a-popconfirm v-if="record.auditstate === 1" title="确定通过此审核吗?" @confirm="() => handleAuditTrue(record.id)">
            <a>审核通过</a>
          </a-popconfirm>
          <a-divider type="vertical" v-if="record.auditstate === 1" />
          <a-popconfirm v-if="record.auditstate === 1" title="确定拒绝此审核吗?" @confirm="() => handleShenJu(record.id)">
            <a>审核拒绝</a>
          </a-popconfirm>
        </span>
      
      </a-table>
    </div>
    <!-- table区域-end -->
    
    <!-- 表单区域 -->
    <product-audit-moadl ref="modalForm"></product-audit-moadl>
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <product-check-audit-modal ref="auditModel" @ok="modalFormOk"></product-check-audit-modal>
  </a-card>
</template>

<script>
  import ProductAuditMoadl from "./modules/ProductAuditMoadl";
  import ProductCheckAuditModal from "./modules/ProductCheckAuditModal";
  import ProductNewBigImg from "./modules/ProductNewBigImg"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from "@/api/manage";
  import { formatDate } from '@/utils/util';
  import JEllipsis from "@/components/jeecg/JEllipsis";

  export default {
    name: "ProductAuditList",
    mixins:[JeecgListMixin],
    components: {
      JEllipsis,
      ProductAuditMoadl,
      ProductNewBigImg,
      ProductCheckAuditModal
    },
    data () {
      return {
        description: '课程审核页面',
        // 表头
        columns: [
          {
            title: '课程标题',
            align:"center",
            dataIndex: 'title',
            scopedSlots: { customRender: 'templateTitle' }
          },
          {
            title: '课程简介',
            align:"center",
            dataIndex: 'introduction',
            scopedSlots: { customRender: 'templateContent' }
          },
          {
            title: '作者昵称',
            align:"center",
            dataIndex: 'nickname'
          },
          {
            title: '课程专辑',
            align:"center",
            dataIndex: 'albumname'
           },
          {
            title: '课程分类',
            align:"center",
            dataIndex: 'catename'
          },
          {
            title: '课程封面',
            align:"center",
            dataIndex: 'coverimg',
            scopedSlots: { customRender: 'avatar' }
          },
          {
            title: '课程价格',
            align:"center",
            dataIndex: 'price'
          },
          {
            title: '审核状态',
            align:"center",
            dataIndex: 'auditstate',
            customRender: function (text) {
              if (text === 1) {
                return '审核中'
              } else if (text === 2) {
                return '审核不通过'
              }
            }
          },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'createtime',
            customRender: function (text) {
              if (text) {
                return formatDate(text, 'yyyy-MM-dd')
              } else {
                return ' '
              }
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        selectList: [],
        url: {
          list: "/product/productcheck/list",
          selectNewList:"/product/productCategory/queryCategorySelect",
          auditTrue: '/product/productcheck/auditTrue',    //审核通过
        },
      }
    },
    created () {
      getAction(this.url.selectNewList).then((res) => {
        if (res.success) {
          this.selectList = res.result;
        } else {
          this.$message.warning(res.message);
        }
      })
    },
    methods: {
      clickThenCheck (record) {
        return {
          on: {
            click: () => {
              this.$refs.modalForm.edit(record);
              this.$refs.modalForm.title = "详情";
              this.$refs.modalForm.disableSubmit = true;
            }
          }
        }
      },
      //  图片点击放大
      bigImg (text) {
        if(text) {
          this.$refs.bigImg.make(text);
        }
      },
      //  审核通过，请求接口
      handleAuditTrue (id) {
        if(!this.url.auditTrue){
          this.$message.error("请设置审核属性!")
          return
        }
        var that = this;
        getAction(this.url.auditTrue, {id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        })
      },
      //  审核拒绝，弹出框=>拒绝理由
      handleShenJu (id) {
        this.$refs.auditModel.open(id);
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
