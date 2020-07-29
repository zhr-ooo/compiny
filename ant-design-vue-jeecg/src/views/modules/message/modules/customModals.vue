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
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="问题">
            <a-input
              placeholder="请输入问题"
              v-decorator="['question', {rules: [{ required: true,message: '请输入问题' }]}]"
              
            />
          </a-form-item>
          <!-- :disabled="autoSubmit" -->
        </a-row>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="回答">
            <a-textarea :autoSize ="{ minRows: 6, maxRows: 10 }"
              placeholder="请输入回答"
              v-decorator="['answers', {rules: [{ required: true,message: '请输入回答' }]}]"
             
            />
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="问题类型">
            <a-select
              placeholder="请选择问题类型"            
              v-decorator="['type', {rules: [{ required: true,message: '请选择问题类型' }]}]"
           
            >
              <a-select-option :value="1">充值</a-select-option>
              <a-select-option :value="2">课程</a-select-option>
              <a-select-option :value="3">群聊</a-select-option>
              <a-select-option :value="4">提现</a-select-option>
            </a-select>
          </a-form-item>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { putAction, postAction, httpAction } from "@/api/manage";
import pick from "lodash.pick";
import * as qiniu from "qiniu-js";
export default {
  data() {
    return {
      enable: 0,
      autoSubmit: false,
      visible: false,
      icon: "",
      model: {},
      loading: false,
      title: "新增",
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
      validatorRules: {},
      url: {
        add: "/system/que/answer/add",
        edit: "/system/que/answer/update" //修改问题分类
      }
    };
  },
  created() {},
  computed: {
    uploadAction: function() {
      return this.url.fileUpload;
    }
  },
  methods: {
    add() {
      this.icon = "";
      this.confirmLoading = false;
      this.edit({});
    },
    edit(record) {
      if (record && record.id && record.id !== "" && record.id !== undefined) {
        this.autoSubmit = true;
        console.log(this.autoSubmit);
      } else {
        this.autoSubmit = false;
        console.log(this.autoSubmit);
      }
      this.icon = record.icon;
      this.canimg = record.icon;
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.parentid = record.parentId == 0 ? record.parentId : undefined;
      this.visible = true;
      if (record.parentId === 0) {
        this.model.parentId = "";
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, "question", "answers", "type")
        );
      });
    },
    close() {
      this.$emit("close");
      this.icon = "";
      this.visible = false;
    },
    handleOk() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = "";
          let formData = Object.assign(this.model, values);

          if (!this.model.id) {
            httpurl += this.url.add;
            // let arr = `?name=${formData.name}&icon=${formData.icon}&phone=${formData.phone}`;
            postAction(httpurl, {
              question: formData.question,
              answers: formData.answers,
              type: formData.type
            })
              .then(res => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.$emit("ok");
                  that.confirmLoading = false;
                  that.close();
                } else {
                  that.$message.warning(res.message);
                  that.confirmLoading = false;
                }
              })
              .finally(() => {});
          } else {
            httpurl += this.url.edit;
            // let arr = `?name=${formData.name}&icon=${formData.icon}&phone=${formData.phone}`;
            putAction(httpurl, {
              question: formData.question,
              answers: formData.answers,
              type: formData.type,
              id: this.model.id
            })
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
