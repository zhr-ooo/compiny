<template>
  <a-modal
    title="团员列表"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading">
    
        <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确定删除吗?" @confirm="() => lookDelete(record.userId)">
            <a>删除</a>
          </a-popconfirm>
        </span>
  
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
  import { getAction } from "@/api/manage";

  export default {
    name: "BigTeamLookModal",
    data () {
      return {
        visible: false,
        confirmLoading: false,
        teamId: null,
        loading:false,
        dataSource:[],
        // 表头
        columns: [
          {
            title: '昵称',
            align:"center",
            dataIndex: 'nickName'
          },
          {
            title: '手机号',
            align:"center",
            dataIndex: 'phone'
          },
          {
            title: 'V云号',
            align:"center",
            dataIndex: 'code'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: '/system/appuserinfo/findBigTeamUserList',
          delete: '/system/appuserinfo/delTeamByUserId'
        }
      }
    },
    methods: {
      open (record) {
        this.visible = true;
        this.teamId = record.id
        this.loadData();
      },
      loadData() {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        var params = { teamId: this.teamId };//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      },
      handleCancel () {
        this.$emit('close');
        this.visible = false;
      },
    //  删除成员
      lookDelete (userId) {
        const param = {
          teamId: this.teamId,
          userId: userId
        }
        const that = this;
        that.confirmLoading = true;
        getAction(this.url.delete, param).then(res => {
          if(res.success){
            that.$message.success(res.message);
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false;
          this.loadData()
        })
      }
    }
  }
</script>

<style scoped>

</style>