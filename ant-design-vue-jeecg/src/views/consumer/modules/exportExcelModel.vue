<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="是否大于800V值">
          <!-- <a-select v-model="queryParam.credits"> -->
          <a-select v-decorator="[ 'credits', {}]">
            <a-select-option value="0">否</a-select-option>
            <a-select-option value="1">是</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="导出用户">
          <!--  <a-select placeholder="请选择导出用户" v-model="queryParam.choose"> -->
          <a-select placeholder="请选择导出用户" v-decorator="[ 'choose', {}]">
            <a-select-option value="0">所有用户</a-select-option>
            <a-select-option value="1">VIP会员</a-select-option>
            <a-select-option value="2">服务商+创客达人</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction, httpAction } from "@/api/manage";
import pick from "lodash.pick";

export default {
  name: "exportExcelModel",
  data() {
    return {
      title: "操作",
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),

      url: {
        add: "/user/excel/exportExcel"
      }
    };
  },
  created() {},
  methods: {
    add() {
      this.edit({});
    },
    edit(record) { 
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, "credits", "choose"));
      });
    },
    close() {
      this.$emit("close");
      this.visible = false;
    },
    handleOk() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          let httpurl = "";
          let method = "";
          if (!this.model.id) {
            httpurl += this.url.add;
            //   method = 'get';
          }
          let formData = Object.assign(this.model, values);
          window.location.href =
            "/vyun/user/excel/exportExcel?credits=" +
            formData.credits +
            "&choose=" +
            formData.choose;
          this.close();

          // httpAction(httpurl,formData,method).then((res)=>{
          //   if(res.success){
          //     that.$message.success(res.message);
          //     that.$emit('ok');
          //   }else{
          //     that.$message.warning(res.message);
          //   }
          // }).finally(() => {
          //   that.confirmLoading = false;
          //   that.close();
          // })
        }
      });
    },
    handleCancel() {
      this.close();
    }
  }
};
</script>

<style lang="less" scoped>
.rechange-num {
  width: auto;
}
</style>