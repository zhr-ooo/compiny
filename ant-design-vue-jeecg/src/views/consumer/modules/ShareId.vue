<template>
  <a-modal
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    cancelText="关闭"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-row style="margin-top:20px">
        <a-col :lg="5">身份：</a-col>
        <a-col :lg="18">
          <a-radio-group name="radioGroup" v-model="isVyunShare">
            <a-radio :value="1">创客达人</a-radio>
            <a-radio :value="0">V云大使</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row :gutter="16" style="padding:15px;"></a-row>
      <a-row :gutter="16" v-if="hide">
        <a-col :lg="5">设置V云靓号:</a-col>
        <a-col :lg="18">
          <a-input ref="setId" v-model="code" />
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { postAction } from "@/api/manage";
export default {
  name: "ShareId",
  data() {
    return {
      visible: false,
      userid: null,
      code: null,
      confirmLoading: false,
      isVyunShare:null,
      hide:false,
      url: {
        setGoodNumber: "/system/appuserinfo/setGoodNumber" // 设置靓号
      }
    };
  },
  methods: {
    open(record) {
      this.visible = true;
      this.userid = record.userid;
      this.isVyunShare = 1;
      if(record.ambassador == 0){
          this.hide = false
      }else {
          this.hide = true;
      }
    },
    close() {
      this.$emit("close");
      this.userid = null;
      this.visible = false;
      this.code = null;
      this.isVyunShare = null;
    },
    handleOk() {
      const that = this;
     
      if (this.code == undefined || this.code == "") {
        this.$message.warning("数值不能为空！");
        return;
      }

      let arr = `?userid=${this.userid}&code=${this.code}`;
     console.log(this.code);
      postAction(this.url.setGoodNumber + arr)
        .then(res => {
          if (res.success) {
            that.$message.success(res.message);
          } else {
            that.$message.warning(res.message);
          }
        })
        .finally(() => {
          that.confirmLoading = false;
          that.close();
        });
    },
    handleCancel() {
      this.close();
    }
  }
};
</script>

<style scoped>
</style>