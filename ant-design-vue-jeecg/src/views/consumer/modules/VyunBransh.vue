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
        <a-col :lg="4">升级方式:</a-col>
        <a-col :lg="19">
          <a-radio-group name="radioGroup" v-model="type">
            <a-radio :value="1">创客达人升级大使服务商</a-radio>
            <a-radio :value="2">直接升级为大使服务商</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { postAction } from "@/api/manage";
export default {
  name: "VyunBransh",
  data() {
    return {
      visible: false,
      userid: null,
      confirmLoading: false,
      type: "",
      url: {
        setAmbassador: "/system/appuserinfo/setAmbassador" // 设置V云大使
      }
    };
  },
  methods: {
    open(record) {
      this.visible = true;
      this.userid = record.userid;
      this.type = 2;
    },
    close() {
      this.$emit("close");
      this.visible = false;
      this.userid = null;
      this.type = null;
    },
    handleOk() {
      let arr = `?userid=${this.userid}&type=${this.type}`;
      const that = this;
      postAction(this.url.setAmbassador + arr)
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