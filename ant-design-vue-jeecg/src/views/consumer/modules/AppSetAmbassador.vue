<template>
  <a-modal
    :title="'修改' + title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="16" v-show="!defaultIsVip">
        <a-col :lg="3">{{ title }}:</a-col>
        <a-col :lg="19">
          <a-input-number :placeholder="`请输入${title}`" v-model="typevulue"></a-input-number>
        </a-col>
      </a-row>

      <a-row :gutter="16" v-show="defaultIsVip">
        <a-col :lg="4">大使充值:</a-col>
        <a-col :lg="19">
          <a-select v-model="typevulue">
            <!-- <a-select-option :value="11">升级大使服务商(7499)</a-select-option>
            <a-select-option :value="12">大使服务商(9999)</a-select-option>-->
            <a-select-option
              v-for="item in typeList"
              :key="item.id"
              :value="item.id"
            >{{ item.name }}({{item.price}})</a-select-option>
          </a-select>
        </a-col>
      </a-row>

      <!-- 新增  设置是否分润-->
      <a-row style="margin-top:20px">
        <a-col :lg="4">是否分润:</a-col>
        <a-col :lg="19">
          <a-radio-group name="radioGroup" v-model="isShareProfit">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction, postAction } from "@/api/manage";

export default {
  name: "AppSetAmbassador",
  data() {
    return {
      title: "修改",
      typeList: [],
      id: "",
      visible: false,
      type: "",
      typevulue: 12,
      isShareProfit: "", //是否分润
      confirmLoading: false,
      defaultIsVip: false,
      url: {
        setAmbassador: "/system/appuserinfo/setAmbassador",
        rechange: "/system/appuserinfo/rechange-money-list?role=3"
      }
    };
  },
  created() {
    getAction(this.url.rechange)
      .then(res => {
        if (res.success) {
          this.typeList = res.result;
        } else {
          this.$message.warning(res.message);
        }
      })
      .catch(err => {
        this.$message.warning(err.message);
      });
  },
  methods: {
    open(record) {
      this.visible = true;
      this.id = record.userid;
      this.isShareProfit = 1;
    },

    close() {
      this.$emit("close");
      this.visible = false;
      this.id = "";
      this.type = "";
      this.isShareProfit = null;
    },
    // 点击确定后的回调函数
    handleOk() {
      const that = this;
      console.log(this.typevulue);
      if (
        (this.typevulue == undefined || this.typevulue == "") &&
        this.typevulue !== 0
      ) {
        this.$message.warning("数值不能为空！");
        return;
      }
      let arr = "";
      let thisurl = "";
      that.confirmLoading = true;
      // this.type === "setVip"
      arr = `?userid=${this.id}&vipId=${this.typevulue}&isShareProfit=${this.isShareProfit}`;
      thisurl = this.url.setAmbassador;

      // console.log(this.url.setVip);
      // console.log(arr)
      postAction(thisurl + arr)
        .then(res => {
          if (res.success) {
            that.$message.success(res.message);
            that.$emit("ok");
            console.log(thisurl + arr);
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
