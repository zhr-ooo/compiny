<template>
  <a-modal
    title="审核拒绝"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="16">
        <a-col :lg="4">
          拒绝理由:
        </a-col>
        <a-col :lg="19">
          <a-textarea placeholder="请输入拒绝理由" v-model="refusereason" :autosize="{ minRows: 3, maxRows: 8 }" />
        </a-col>
      </a-row>
    </a-spin>
  
  </a-modal>
</template>

<script>
  import { getAction } from "@/api/manage";

  export default {
    name: "AppUserCheckAuditModal",
    data () {
      return {
        id: '',
        visible: false,
        refusereason: '',
        confirmLoading: false,
        auditFalse: '/user/appusercheck/auditFalse',    //审核拒绝
      }
    },
    methods: {
      open (id) {
        this.visible = true;
        this.id = id;
        this.refusereason = '';
      },

      close () {
        this.$emit('close');
        this.visible = false;
        this.id = '';
        this.refusereason = '';
      },
      handleOk () {
        const that = this;
        if (!this.refusereason || this.refusereason === '') {
          this.$message.warning('请输入拒绝理由！')
        }else {
          that.confirmLoading = true;
          let arr = {
            id: this.id,
            refusereason: this.refusereason
          };
          console.log(arr);
          getAction(this.auditFalse,arr).then((res) => {
            if(res.success){
              that.$message.success(res.message);
              that.$emit('ok');
            }else{
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })
        }
        
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style scoped>

</style>
