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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="直推">
          <a-input-number
            style="margin-left:51px"
            v-decorator="[ 'directly', {rules: [{ required: true,message: '请输入直推' }, { validator: makeNumber}]}]"
            :disabled="disableSubmit"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="间推">
          <a-input-number
            style="margin-left:51px"
            v-decorator="[ 'indirect', {rules: [{ required: true,message: '请输入间推' }, { validator: makeNumber}]}]"
            :disabled="disableSubmit"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="直推创客达人或大使"
          style="width:800px"
        >
          <a-input-number
            v-decorator="[ 'directlyHigh', {rules: [{ required: true,message: '请输入直推创客达人或大使' }, { validator: makeNumber}]}]"
            :disabled="disableSubmit"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="间推创客达人或大使"
          style="width:800px"
        >
          <a-input-number
            v-decorator="[ 'indirectHigh', {rules: [{ required: true,message: '请输入间推创客达人或大使' }, { validator: makeNumber}]}]"
            :disabled="disableSubmit"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="课程引导奖"
          style="margin-left:20px"
        >
          <a-input-number
            style="margin-left:35px"
            v-decorator="[ 'guide', {rules: [{ required: true,message: '请输入课程引导奖' }, { validator: makeNumber}]}]"
            :disabled="disableSubmit"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="课程发布者师傅"
          style="margin-left:20px"
        >
          <a-input-number
            style="margin-left:35px"
            v-decorator="[ 'autherSuper', {rules: [{ required: true,message: '请输入课程发布者师傅' }, { validator: makeNumber}]}]"
            :disabled="disableSubmit"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="转发者">
          <a-input-number
            style="margin-left:51px"
            v-decorator="[ 'forwarding', {rules: [{ required: true,message: '请输入转发者' }, { validator: makeNumber}]}]"
            :disabled="disableSubmit"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="免费奖励"
          style="margin-left:10px"
        >
          <a-input-number
            style="margin-left:41px"
            v-decorator="[ 'freeReward', {rules: [{ required: true,message: '请输入免费奖励' }, { validator: makeNumber}]}]"
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
  name: "VipRetailModal",
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
        edit: "/other/vipFenxiao/edit"
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
            "directly",
            "indirect",
            "guide",
            "autherSuper",
            "forwarding",
            "freeReward",
            "directlyHigh",
            "indirectHigh"
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
</style>
