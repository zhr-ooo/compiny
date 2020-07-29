<template>
  <a-card :bordered="false">
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="推送标题"
        >
          <a-input placeholder="请输入推送标题" v-decorator="[ 'name', {rules: [{ required: true, message: '描述不能为空' }]} ]"></a-input>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="推送内容"
          style="position: relative"
        >
          <a-textarea :rows="5" @input="textInputHandle" placeholder="请输入最多30个字的推送内容" v-decorator="[ 'content', validatorRules.content ]" />
          <p class="length_address">{{ conLength }}/30</p>
        </a-form-item>
      </a-form>
      <div class="anty-form-btn">
        <a-button @click="emptyCurrForm" type="default" htmlType="button" icon="sync">重置</a-button>
        <a-button @click="submitCurrForm" type="primary" htmlType="button" icon="form">保存</a-button>
      </div>
    </a-spin>
  </a-card>
</template>

<script>
  import { postAction } from "@/api/manage";
  export default {
    name: "PushMessage",
    data () {
      return {
        form: this.$form.createForm(this),
        content: '',    //富文本数据
        loading: false,
        conLength: 0,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16}
        },
        validatorRules: {
          content: {rules: [
              { required: true, message: '请输入推送内容!'},
              { min: 0, max: 30, message: '长度不超过 30 个字', trigger: 'blur' }
            ]}
        },
        url: {
          json: '/system/message/official/update/json'
        }
      }
    },
    created() {
      this.form.resetFields()
    },
    methods: {
      // 文本框内容变化
      textInputHandle () {
        // 获取长度
        const conLength = this.form.getFieldValue('content').length;
        this.conLength = conLength;
        console.log(conLength)
      },
      //重置
      emptyCurrForm () {
        this.form.resetFields();
        this.content = '';
      },
      // 保存提交
      submitCurrForm () {
        this.form.validateFields(['name', 'content'], { force: true }, (err, values) => {
          if (!err) {
            if (!this.url.json) {
              return
            }
            // if (!this.content || this.content === '' || this.content === undefined) {
            //   this.$message.warning('请输入推送内容！');
            //   return
            // }
            this.loading = true;
            // formData.name = values.name;
            // formData.content = values.content;
            let formData = `?name=${values.name}&content=${values.content}`;
            console.log(formData);
            postAction(this.url.json+formData).then(res => {
              if (res.success) {
                this.$message.success(res.message);
              } else {
                this.$message.warning(res.message);
              }
            }).finally(() => {
              this.loading = false;
            })
            // formData.eventContent = values.eventContent;
          }
        })
      }
    }
  }
</script>

<style scoped>
  .anty-form-btn {
    width: 100%;
    text-align: center;
  }
  
  .anty-form-btn button {
    margin: 0 5px;
  }
  .length_address {
    position: absolute;
    right: 10px;
    bottom: -10px;
    margin: 0;
  }
</style>