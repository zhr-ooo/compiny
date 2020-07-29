<template>
  <a-modal
    title="添加团员"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="V云号"
        >
          <a-input-search placeholder="请输入V云号" v-decorator="[ 'userId', {rules: [{ required: true, message: 'V云号不能为空' }]}]" @search="onSearch"></a-input-search>
        </a-form-item>
      </a-form>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading">
    
        <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确定添加吗?" @confirm="() => lookAdd(record.userId)">
            <a>添加</a>
          </a-popconfirm>
        </span>
      
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
  import { getAction } from "@/api/manage";

  export default {
    name: "BigTeamAddModal",
    data () {
      return {
        visible: false,
        confirmLoading: false,
        teamId: null,
        loading:false,
        dataSource:[],
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
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
          list: '/system/appuserinfo/findUserListByCode',
          add: '/system/appuserinfo/updateTeamByUserId'
        }
      }
    },
    methods: {
      open (record) {
        this.form.resetFields()
        this.visible = true;
        this.teamId = record.id
      },
      onSearch(value) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        this.form.validateFields((err) => {
          if (!err) {
            var params = { code: value };//查询条件
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
          }
        })
        
      },
      handleCancel () {
        this.$emit('close');
        this.visible = false;
        this.dataSource = [];
      },
      //  添加成员
      lookAdd (userId) {
        const param = {
          teamId: this.teamId,
          userId: userId
        }
        const that = this;
        that.confirmLoading = true;
        getAction(this.url.add, param).then(res => {
          if(res.success){
            that.$message.success(res.message);
            this.$emit('ok')
          }else{
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false
          this.handleCancel()
        })
      }
    }
  }
</script>

<style scoped>

</style>