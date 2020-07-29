<template>
  <a-row :gutter="10">
    <a-col :md="8" :sm="24">
      <a-card :bordered="false">
        <div>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :loading="loading"
            @change="handleTableChange"
            :pagination="false"
            :customRow="clickThenCheck"
          >
          </a-table>
        </div>
      </a-card>
      
    </a-col>
    <a-col :md="15" :sm="24">
      <a-card :bordered="false">
        <a-form :form="form">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="描述"
          >
            <a-input placeholder="描述" v-decorator="[ 'descr', {rules: [{ required: true, message: '描述不能为空' }]} ]"></a-input>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="数据"
            v-if="type === 1"
          >
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :supportServerRender="true"
              :customRequest="setCustomRequest"
              v-decorator="[ 'value', {} ]"
            >
              <img v-if="coverimg" :src="coverimg" alt="avatar" style="max-width: 150px;" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text" v-if="!loading">Upload</div>
                <div class="ant-upload-text" v-if="loading">{{ percent }}%</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="数据"
            v-else-if="type === 2"
          >
            <a-textarea :rows="10" placeholder="请输入数据" v-model="coverimg"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="数据"
            v-else-if="type === 3"
          >
            <j-editor v-model="coverimg"></j-editor>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="数据"
            v-else
          >
            <a-textarea :rows="10" placeholder="请输入数据" v-decorator="['value', {}]"/>
          </a-form-item>
        </a-form>
        <div class="anty-form-btn">
          <a-button @click="emptyCurrForm" type="default" htmlType="button" icon="sync">重置</a-button>
          <a-button @click="submitCurrForm" type="primary" htmlType="button" icon="form">修改并保存</a-button>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import pick from 'lodash.pick'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { getAction, httpAction } from "@/api/manage";
  import JCodeEditor from "@/components/jeecg/JCodeEditor";
  import JEditor from "@/components/jeecg/JEditor";

  export default {
    name: "WithdrawSettingList",
    mixins: [JeecgListMixin],
    components: {
      JCodeEditor,
      JEditor
    },
    data() {
      return {
        form: this.$form.createForm(this),
        type: null,
        model: {},
        coverimg: '',
        percent: '',
        canimg: '',
        loading: false,
        headers: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 4}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 19}
        },
        columns: [
          {
            title: '描述',
            align:"center",
            dataIndex: 'descr'
          },
        ],
        baseUrl: '/system/sysparam/',
        url: {
          list: '/system/sysparam/otherSetting',
          edit: '/system/sysparam/edit'
        }
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token};
    },
    methods: {
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        this.loading = true;
        getAction(this.url.list).then((res) => {
          if (res.success) {
            this.dataSource = res.result;
            console.log(res)
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      },
      clickThenCheck (record) {
        return {
          on: {
            click: () => {
              this.model = Object.assign({}, record)
              this.setValuesToForm(record)
            }
          }
        }
      },
      setValuesToForm (record) {
        // this.$nextTick(() => {
          this.form.setFieldsValue(pick(record, 'categoryId', 'chooseFlag', 'code', 'descr', 'id', 'type', 'value'))
        // });
        this.type = record.type;
        this.coverimg = record.value;
        this.canimg = record.value;
      },
      //重置
      emptyCurrForm () {
        this.form.resetFields()
      },
    //  提交
      submitCurrForm () {
        this.form.validateFields((err, values) => {
          if (!err) {
            if (!this.url.edit) {
              return
            }
            let formData = Object.assign(this.model, values)
            console.log(formData)
            formData.value = this.coverimg;
            httpAction(this.url.edit, formData, 'put').then(res => {
              if(res.success){
                this.$message.success(res.message);
                this.loadData()
              }else{
                this.$message.warning(res.message);
              }
            })
          }
        })
      },
    },
    watch: {
    
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
</style>