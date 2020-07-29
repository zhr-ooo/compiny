<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分销角色">
          <a-input placeholder="请输入分类名称" v-decorator="['identity', {}]" disabled />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="本人获得打赏收益">
          <a-input-number v-decorator="[ 'rewardme', {rules: [{ required: true,message: '请输入本人获得打赏收益' }, { validator: makeNumber}]}]" :disabled="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="直推打赏他人">
          <a-input-number v-decorator="[ 'directlyrewardother', {rules: [{ required: true,message: '请输入直推打赏他人' }, { validator: makeNumber}]}]" :disabled="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="间推打赏他人">
          <a-input-number v-decorator="[ 'indirectrewardother', {rules: [{ required: true,message: '请输入间推打赏他人' }, { validator: makeNumber}]}]" :disabled="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="直推被打赏">
          <a-input-number v-decorator="[ 'directlyreward', {rules: [{ required: true,message: '请输入直推被打赏' }, { validator: makeNumber}]}]" :disabled="disableSubmit" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="转发者">
          <a-input-number v-decorator="[ 'forwarding', {rules: [{ required: true,message: '请输入转发者' }, { validator: makeNumber}]}]" :disabled="disableSubmit" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'

  export default {
    name: "RewardRetailModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 },
        },

        confirmLoading: false,
        disableSubmit: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          edit: "/other/forwardFenxiao/edit",
        },
      }
    },
    created () {
    },
    methods: {
      makeNumber (rule, value, callback) {
        if (value<1 || value > 99) {
          callback('数值应在1-99之间')
        }else {
          callback()
        }
      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'identity','rewardme','directlyrewardother','indirectrewardother','directlyreward','forwarding'))
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化

            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
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
        })
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>
