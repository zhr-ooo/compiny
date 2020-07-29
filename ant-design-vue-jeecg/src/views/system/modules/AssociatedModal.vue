<template>
  <a-modal
    title="课程作者"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="课程作者">
          <a-auto-complete
            class="global-search"
            @select="onSelect"
            @search="handleSearch"
            optionLabelProp="text"
            v-decorator="['selected',{ rules: [{ required: true, message: '请输入作者名称' }] }]"
            placeholder="请输入作者名称"
          >
            <template slot="dataSource">
              <a-select-option v-for="item in dataSource" :key="item.userId" :text="item.nickName" :value="String(item.userId)" class="selece-option">
                <a-avatar :src="item.header" :srcSet="item.header" style="margin-right: 15px"></a-avatar>
                {{ item.nickName }}
              </a-select-option>
            </template>
            <a-input class="associate_input">
              <a-button slot="suffix" class="search-btn" type="primary" size="large" @click="beginSearch">
                <a-icon type="search"></a-icon>
              </a-button>
            </a-input>
          </a-auto-complete>
        </a-form-item>
      </a-form>
    </a-spin>
  
  </a-modal>
</template>

<script>
  import { getAction } from "@api/manage";

  export default {
    name: "AssociatedModal",
    data () {
      return {
        appUserId: null,
        userId: null,
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        searchParam: '',    // 搜索字段
        selectParam: '',    //  选中作者
        dataSource: [],     // 选择数据源
        url: {
          searchUrl: '/system/appuserinfo/getUserBYPhoneOrCodeOrNickName',
          // associUrl: '/sys/user/checkuser',
          // updateId: '/sys/user/updateSysUserToAppUserId'
        }
        
      }
    },
    methods: {
      show () {
        this.form.resetFields();
        // this.userId = id;
        this.visible = true
      },
      // 表单提交
      handleOk () {
        // 验证用户是否已进行了关联
        this.form.validateFields((err) => {
          if (!err) {
            this.confirmLoading = true;
            let seleData = {
              authorName: this.selectParam,
              author: this.appUserId
            }
            this.$emit('ok', seleData);

            this.confirmLoading = false;
            this.handleCancel();
            // getAction(this.url.associUrl, { appUserId: this.appUserId }).then(res => {
            //   if(res.success) {
            //     getAction(this.url.updateId, { appUserId: this.appUserId, userId: this.userId }).then(res => {
            //       if (res.success) {
            //         this.$message.success(res.message);
            //         this.$emit('ok');
            //       }else{
            //         this.$message.warning(res.message);
            //       }
            //     }).finally(() => {
            //
            //     })
            //   } else {
            //     this.$message.warning(res.message)
            //   }
            // }).catch(err => {
            //   this.$message.warning(err.message)
            // })
          }
        })
      },
      // modal取消
      handleCancel () {
        this.$emit('close');
        this.dataSource = [];
        this.searchParam = '';
        this.visible = false;
      },
    //  输入选择框
      onSelect (value) {
        console.log(value)
        this.dataSource.forEach(item => {
          if (item.userId === Number(value)) {
            this.selectParam = item.nickName;
            this.appUserId = value
          }
        })
      },
      handleSearch(value) {
        this.searchParam = value
      },
    //  开始搜索
      beginSearch () {
        getAction(this.url.searchUrl, {searchParam: this.searchParam}).then(res => {
          console.log(res)
          if (res.success) {
            if (res.result.length === 0) {
              this.$message.warning('暂无数据')
            } else {
              this.dataSource = res.result
            }
          } else {
            this.$message.warning(res.message)
          }
        }).catch(err => {
          this.$message.warning(err.message)
        })
      }    
    }
  }
</script>

<style>
  .global-search .associate_input .ant-input-suffix {
    right: 0 !important;
  }
  .global-search .ant-input-suffix .ant-btn-lg {
    height: 32px;
  }
  .global-search .ant-input-affix-wrapper .ant-input:not(:last-child) {
    padding: 0 50px 0 12px;
  }
  
  .global-search.ant-select-auto-complete .ant-input-affix-wrapper .ant-input-suffix button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .selece-option {
    padding: 10px 10px;
    display: flex;
    align-items: center;
  }
</style>