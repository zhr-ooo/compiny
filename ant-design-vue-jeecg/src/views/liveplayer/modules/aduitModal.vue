<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <!-- 新增  设置是否分润-->
      <a-row style="margin-top:20px">
        <a-col :lg="4">审核状态:</a-col>
        <a-col :lg="19">
          <a-radio-group name="radioGroup" v-model="state">
            <a-radio :value="1">审核通过</a-radio>
            <a-radio :value="2">审核失败</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="失败原因" v-if="state == 2">
          <textarea v-model="reason" rows="5" style="width: 550px;height:100px"></textarea>
        </a-form-item>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { putAction } from "@/api/manage";

export default {
  name: "aduitModal",
  data() {
    return {
      title: "审核状态",
      visible: false,
      reason: "",
      typevulue: 18,
      state: 1,
      confirmLoading: false,
      url: {
        audit: "/system/mall/goods/audit"
      }
    };
  },
  watch: {
    reason() {
      if (this.reason.length > 20) {
        alert("审核原因最多不能超过20个字符");
        this.reason=String(this.reason).slice(0,20)
        return;
      } else if(this.reason.length == 0){
        this.reason == ""
      }
    }
  },
  methods: {
    open(record) {
      this.visible = true;
      this.goodId = record.id;
      this.state = 1;
      this.reason == "";
    },

    close() {
      this.$emit("close");
      this.visible = false;
      this.state = null;
      this.reason = '';
    },
    // 点击确定后的回调函数
    handleOk() {
      const that = this;
      let arr = "";
      that.confirmLoading = true;
      arr = `?goodId=${this.goodId}&state=${this.state}&reason=${this.reason}`;
      console.log(arr);

      putAction(this.url.audit + arr)
        .then(res => {
          if (res.success) {
            that.$message.success(res.message);
            that.$emit("ok");
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
.ant-input-number,
.ant-select {
  width: 80%;
}
</style>
