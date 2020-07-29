<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色">
          <a-select placeholder="清选择角色" v-decorator="[ 'role', {rules: [{ required: true,message: '请选择角色' }]}]" @change="handelSelect">
            <a-select-option value="0">普通会员</a-select-option>
            <a-select-option value="1">收费会员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开始时间"
          v-show="!disSubmit"
        >
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="[ 'startTime', {rules: [{ required: true,message: '请选择开始时间' }]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结束时间"
          v-show="!disSubmit">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="[ 'endTime', {rules: [{ required: true,message: '请选择结束时间' }]}]" />
        </a-form-item>
      </a-form>
    </a-spin>

  </a-modal>
</template>

<script>
  import { postAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "AppUserInfoRoleModel",
    data () {
      return {
        title:"修改角色",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        loading: false,
        confirmLoading: false,
        disSubmit: false,
        form: this.$form.createForm(this),
        url: {
          setRole: "/system/appuserinfo/setRole"
        },
      }
    },
    methods: {
      open (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'role','startTime','endTime'))
          this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
          this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
        });
        if (record.role == '0') {
          this.disSubmit = true
        } else {
          this.disSubmit = false
        }
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
            let httpurl = this.url.setRole;
            let arr = '';
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.endTime = formData.endTime?formData.endTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.startTime = formData.startTime?formData.startTime.format('YYYY-MM-DD HH:mm:ss'):null;
            if (that.disSubmit) {
              arr = `?userid=${formData.userid}&role=${formData.role}`
            } else {
              arr = `?userid=${formData.userid}&role=${formData.role}&startTime=${formData.startTime}&endTime=${formData.endTime}`
            }
            console.log(formData);
            console.log(arr)
            postAction(httpurl + arr).then((res)=>{
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
      handelSelect (value) {
        if (value == '0') {
          this.disSubmit = true
        } else {
          this.disSubmit = false
        }
      }
    }
  }
</script>

<style scoped>

</style>
