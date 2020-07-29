<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分销角色">
          <a-input
            style="margin-left:51px"
            placeholder="请输入分类名称"
            v-decorator="['identity', {}]"
            disabled
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="赠送VIP数量">
          <a-input-number
            style="margin-left:51px"
            v-decorator="[ 'vipNumber', {rules: [{ required: true,message: '请输入赠送VIP数量' }, { validator: makeNumber}]}]"
            :disabled="disableSubmit"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="赠送创客达人数量">
          <a-input-number
            style="margin-left:51px"
            v-decorator="[ 'creatorNumber', {rules: [{ required: true,message: '请输入赠送创客达人数量' }, { validator: makeNumber}]}]"
            :disabled="disableSubmit"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="赠送大使服务商数量"
          style="width:600px"
        >
          <a-input-number
          style="margin-left:41px"
            v-decorator="[ 'ambassadorNumber', {rules: [{ required: true,message: '请输入赠送大使服务商数量' }, { validator: makeNumber}]}]"
            :disabled="disableSubmit"
          />
        </a-form-item>
       
        
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from "@/api/manage";
import pick from "lodash.pick";

export default {
  name: "give",
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
      disableSubmit: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        edit: "/other/giving-number/edit"
      }
    };
  },
  created() {},
  methods: {
    makeNumber(rule, value, callback) {
      if (value < 0 || value > 100) {
        callback("数值应在0-100之间");
      } else {
        callback();
      }
    },
    add() {
      this.edit({});
    },
    edit(record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        // this.$nextTick：等你页面刷新完之后，再执行回调函数中的方法
        this.form.setFieldsValue(
          pick(
            this.model,
            "identity",
            "vipNumber",
            "creatorNumber",
            "ambassadorNumber",
          )
        );
        // pick：返回一个只有列入挑选key属性的对象。其中，参数object为JSON格式的对象，*keys表示多个需要挑选出来的key属性。
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
          that.confirmLoading = true;
          let httpurl = "";
          let method = "";
          if (!this.model.id) {
            httpurl += this.url.add;
            method = "post";
          } else {
            httpurl += this.url.edit;
            method = "put";
          }
          let formData = Object.assign(this.model, values);
          //时间格式化
          console.log(formData);
          httpAction(httpurl, formData, method)
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
.ant-col-sm-5 {
    display: block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 22.833333%;
}
</style>
