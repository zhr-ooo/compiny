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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="被邀请人昵称">
          <a-input v-decorator="['nickName', {}]" disabled />
        </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="被邀请人手机号">
          <a-input v-decorator="['phone', {}]" disabled />
        </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="被邀请人V云号">
          <a-input v-decorator="['code', {}]" disabled />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新的邀请人V云号">
          <!-- <a-input v-if="autoSubmit" placeholder :disabled="autoSubmit" :value="inviteId" /> -->
          <a-auto-complete
            
            class="global-search"
            @select="onSelect"
            @search="handleSearch"
            optionLabelProp="text"
            v-decorator="['inviteId',{ rules: [{ }] }]"
            placeholder="请输入被邀请人id"
            
          >
            <template slot="dataSource">
              <a-select-option
                v-for="item in dataSource"
                :key="item.nickName"
                :text="item.nickName"
                class="selece-option"
              >
                <a-avatar :src="item.header" :srcSet="item.header" style="margin-right: 15px"></a-avatar>
                {{ item.nickName }}
              </a-select-option>
            </template>
            <a-input class="associate_input">
              <a-button
                slot="suffix"
                class="search-btn"
                type="primary"
                size="large"
                @click="beginSearch"
              >
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
import { httpAction, getAction } from "@/api/manage";
import pick from "lodash.pick";
export default {
  name: "InvitaionMoudles",
  data() {
    return {
      title: "操作",
      visible: false,
      headers: {},
      loading: false,

      disableSubmit: false,
      autoSubmit: false,
      //   teamName: "",
      userId: "",
      inviteId: "",
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      searchParam: "", // 搜索字段
      dataSource: [], // 选择数据源
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: "/system/appuserinfo/add-vip-giving",
        edit: "/system/bigteam/edit",
        // qiniuToken: "/qiniuUpToken",
        searchUrl: "/system/appuserinfo/getUserBYPhoneOrCodeOrNickName",
        relation: "/system/appuserinfo/update-invite-relation"
      }
    };
  },
  methods: {
    // add() {
    //   //   this.teamName = "";
    //   this.edit({});
    // },
    open(record) {
      if (
        record &&
        record.userId &&
        record.userId !== "" &&
        record.userId !== undefined
      ) {
        this.autoSubmit = true;
        console.log(this.autoSubmit);
      } else {
        this.autoSubmit = false;
        console.log(this.autoSubmit);
      }
      console.log(record);
      this.teamName = record.teamName;
      this.userId = record.userId;
      this.inviteId = record.inviteId;
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, "inviteId", "userId", "userName", "teamNum","nickName","phone","code")
        );
      });
      console.log(this.form);
    },
    close() {
      this.$emit("close");
      this.visible = false;
      this.userId = "";
      this.inviteId = "";
      this.dataSource = [];
      this.searchParam = "";
      this.disableSubmit = false;
    },
    handleOk() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = this.url.relation;
          let method = "post";
        //   if (!this.model.userId) {
        //     httpurl += this.url.add;
        //     method = "post";
        //   } else {
        //     // httpurl += this.url.edit;
        //     // method = "put";
        //     console.log(111);
        //     alert("用户已经存在！");
        //   }
          let formData = Object.assign(this.model, values);
          formData.inviteId = this.inviteId;
          console.log("userid" + this.userId);
           formData.userId = this.userId;
          console.log("inviteId" + formData.inviteId);
         
          //时间格式化
          // let arr = `?userId=${this.userId}&inviteId=${this.inviteId}`;
          // postAction(httpurl,{formData}).then(res => {

          httpAction(
            httpurl +
              "?userId=" +
              this.userId +
              "&inviteId=" +
              this.inviteId,
            null,
            method
          )
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
    },
    // 自定义上传

    //  输入选择框
    onSelect(value) {
      this.dataSource.forEach(item => {
        if (item.nickName === value) {
          this.inviteId = item.userId;
        }
      });
    },
    // onSelect1(value) {
    //   this.dataSource.forEach(item => {
    //     if (item.nickName === value) {
    //       this.inviteId = item.userId;
    //     }
    //   });
    // },
    handleSearch(value) {
      //   console.log("search", value);
      this.searchParam = value;
    },
    //  开始搜索
    beginSearch() {
      getAction(this.url.searchUrl, { searchParam: this.searchParam })
        .then(res => {
          console.log(res);
          if (res.success) {
            if (res.result.length === 0) {
              this.$message.warning("暂无数据");
            } else {
              this.dataSource = res.result;
            }
          } else {
            this.$message.warning(res.message);
          }
          console.log(11111 + res);
        })
        .catch(err => {
          this.$message.warning(err.message);
        });
    }
  }
};
</script>

<style lang="less">
.global-search .associate_input .ant-input-suffix {
  right: 0 !important;
}
.global-search .ant-input-suffix .ant-btn-lg {
  height: 32px;
}
.global-search .ant-input-affix-wrapper .ant-input:not(:last-child) {
  padding: 0 50px 0 12px;
}

.global-search.ant-select-auto-complete
  .ant-input-affix-wrapper
  .ant-input-suffix
  button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.selece-option {
  padding: 10px 10px;
  display: flex;
  align-items: center;
}
</style>
