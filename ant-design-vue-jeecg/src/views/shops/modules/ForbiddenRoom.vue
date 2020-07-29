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
      <a-row :gutter="16">
        <a-col :lg="4">封禁等级:</a-col>
        <a-col :lg="19">
          <a-select v-model="level">
            <a-select-option :value="1">A</a-select-option>
            <a-select-option :value="2">B</a-select-option>
            <a-select-option :value="3">C</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row :gutter="16" style="margin-top:15px;">
        <a-col :lg="4">封禁理由:</a-col>
        <a-col :lg="19">
          <!-- v-model="refusereason" -->
          <a-textarea
            placeholder="请输入拒绝理由"
            v-model="reason"
            :autoSize="{ minRows: 6, maxRows: 10 }"
          />
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction, postAction } from "@/api/manage";

export default {
  name: "ForbiddenRoom",
  data() {
    return {
      level: 1,
      title: "",
      typeList: [],
      id: "",
      reason: "",
      visible: false,
      confirmLoading: false,
      url: {
        ban: "/system/live/room/ban"
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
      this.reason == "";
      this.visible = true;
      this.roomId = record.id;
      this.state = record.state;
      this.code = record.code;
    },
  
    close() {
      this.$emit("close");
      this.visible = false;
      this.id = "";
      this.type = "";
      this.reason == "";
      this.isShareProfit = null;
    },
    // 点击确定后的回调函数
    handleOk() {
      const that = this;
      if (
        (this.level == undefined || this.level == "") &&
        this.level !== 0
      ) {
        this.$message.warning("数值不能为空！");
        return;
      }
      let thisurl = "";
      that.confirmLoading = true;
      if (this.level == 1) {
        var type = "A";
      } else if (this.level == 2) {
        var type = "B";
      } else if (this.level == 3) {
        var type = "C";
      }
      var state = this.state;
      if (state === 1) {
        var en = 2;
        var arr = `?roomId=${this.roomId}&state=${en}&level=${type}&reason=${this.reason}&code=${this.code}`;
      } else if (state === 2) {
        var en = 1;
        var arr = `?roomId=${this.roomId}&state=${en}&level=${type}&reason=${this.reason}&code=${this.code}`;
      }
      thisurl = this.url.ban;

      // console.log(this.url.setVip);
      console.log(arr);
      postAction(thisurl + arr)
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
