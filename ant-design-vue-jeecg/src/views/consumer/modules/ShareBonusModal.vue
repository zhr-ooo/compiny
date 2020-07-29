<template>
  <a-modal
    title="分红"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分红"
        >
          <a-input-number class="share_bonus" placeholder="请输入分红" v-decorator="['money', validatorRules.money]"></a-input-number>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { getAction } from "@/api/manage";

  export default {
    name: "ShareBonusModal",
    data () {
      return {
        visible: false,
        confirmLoading: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: this.$form.createForm(this),
        validatorRules: {
          money: {
            rules: [
              {
                required: true,
                message: '请输入分红金额!'
              },
              {
                validator: this.validatorDictMoney
              }]}
        },
        url: {
          list: '/system/appuserinfo/particMoney'
        }
      }
    },
    methods: {
      validatorDictMoney (rule, value, callback) {
        if (value < 0) {
          callback('分红金额必须大于0')
        } else {
          callback()
        }
      },
      open () {
        this.visible = true;
        this.form.resetFields()
      },
      close () {
        this.$emit('close')
        this.visible = false
      },
      handleOk () {
        const that = this;
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values)
            getAction(this.url.list, formData).then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                this.close()
              } else {
                that.$message.warning(res.message)
              }
            }).catch((err) => {
              this.$message.warning(err.message)
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style>
.share_bonus {
  width: 100%;
}
</style>