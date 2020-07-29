<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="12" :sm="12">
            <a-form-item label="团队名称">
              <a-input placeholder="请输入团队名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
        <span slot="image" slot-scope="text">
          <a-avatar shape="square" size="large" :src="text" :srcSet="text" @click.stop="bigImg(text, 600)"></a-avatar>
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改团队信息</a>

          <a-divider type="vertical" />
          <a @click="handleLook(record)">查看团队成员</a>
          <a-divider type="vertical" />
          <a @click="handleAddYuan(record)">增加团队成员</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <bigTeam-modal ref="modalForm" @ok="modalFormOk"></bigTeam-modal>
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <big-team-look-modal ref="lookModal" @ok="modalFormOk"></big-team-look-modal>
    <big-team-add-modal ref="addModal" @ok="modalFormOk"></big-team-add-modal>
  </a-card>
</template>

<script>
  import ProductNewBigImg from "../product/modules/ProductNewBigImg";
  import BigTeamModal from './modules/BigTeamModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BigTeamLookModal from "./modules/BigTeamLookModal";
  import BigTeamAddModal from "./modules/BigTeamAddModal";

  export default {
    name: "BigTeamList",
    mixins:[JeecgListMixin],
    components: {
      BigTeamModal,
      ProductNewBigImg,
      BigTeamLookModal,
      BigTeamAddModal
    },
    data () {
      return {
        description: '大V团队管理页面',
        // 表头
        columns: [
          {
            title: '大V团名',
            align:"center",
            dataIndex: 'name'
           },
          {
            title: '图片',
            align:"center",
            dataIndex: 'image',
            scopedSlots: { customRender: 'image' }
           },
          {
            title: '团长名称',
            align:"center",
            dataIndex: 'userName'
           },
          {
            title: '团队人数',
            align:"center",
            dataIndex: 'teamNum'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/system/bigteam/list"
        },
    }
  },
    methods: {
    //  查看团队成员
      handleLook (record) {
        this.$refs.lookModal.open(record)
      },
    //  添加成员
      handleAddYuan (record) {
        this.$refs.addModal.open(record)
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>