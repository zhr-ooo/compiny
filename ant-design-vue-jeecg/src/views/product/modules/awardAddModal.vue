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
        <a-row :lg="12">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="有奖问答标题">
            <input
              placeholder="请输入有奖问答标题"
              v-decorator="['title', {rules: [{ required: true,message: '请输入有奖问答标题' }]}]"
              style="width: 500px;height:32px;border-radius:5px;border:1px solid rgb(217,217,217)"
            />
          </a-form-item>
        </a-row>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="封面图片">
          <a-upload
            accept="image/*"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="imgCustomRequest"
            v-decorator="['images', {rules: [{ required: true,message: '请上传封面' }]} ]"
          >
            <img v-if="images" :src="images" alt="avatar" style="max-width: 150px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text" v-if="!loading">Upload</div>
              <div class="ant-upload-text" v-if="loading">{{ percent }}%</div>
            </div>
            <!-- <img  :src="icon" alt="avatar" style="max-width: 150px;" /> -->
          </a-upload>
        </a-form-item>

        <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
          <a-select
            placeholder="请选择类型"
            @select="typeSelectHandle"
            v-decorator="['parentId', {rules: [{ required: true,message: '请选择类型' }]}]"
            :disabled="autoSubmit"
          >
            <a-select-option :value="1">VIP用户</a-select-option>
            <a-select-option :value="2">普通用户</a-select-option>
          </a-select>
        </a-form-item>

        <a-row :lg="8">
          <a-form-item
            v-if="!autoSubmit && type == 1"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="有奖问答分类"
          >
            <a-select
              placeholder="请选择有奖问答分类"
              @select="cateoryHandle"
              v-decorator="['groupName', {rules: [{ required: true,message: '请选择有奖问答分类' }]}]"
              :disabled="autoSubmit"
            >
              <!-- @select="cateoryHandle" -->
              <a-select-option
                v-for="(item, index) in selectList"
                :key="index"
                :value="item.id"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item
            v-if="!autoSubmit && type == 2"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="有奖问答分类"
          >
            <a-select
              placeholder="请选择有奖问答分类"
              @select="cateoryHandle1"
              v-decorator="['groupName', {rules: [{ required: true,message: '请选择有奖问答分类' }]}]"
              :disabled="autoSubmit"
            >
              <!--   v-decorator="['groupName1', {rules: [{ required: true,message: '请选择有奖问答分类' }]}]" -->
              <a-select-option
                v-for="(item, index) in selectList1"
                :key="index"
                :value="item.id"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户昵称">
            <a-input v-if="autoSubmit" placeholder :disabled="autoSubmit" :value="teamName" />
            <a-auto-complete
              v-else
              class="global-search"
              @select="onSelect"
              @search="handleSearch"
              optionLabelProp="text"
              v-decorator="['userName',{ rules: [{required: true,message: '请选择用户'}] }]"
              placeholder="请选择用户"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="item in dataSource"
                  :key="item.userId"
                  :text="item.nickName"
                  :value="String(item.userId)"
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
        </a-row>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选项A">
          <a-input
            placeholder="请设置选项A的答案"
            v-decorator="['firstAnswer', {rules: [{ required: true,message: '请设置选项A的答案' }]}]"
            
             
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选项B">
          <a-input
            placeholder="请设置选项B的答案"
            v-decorator="['secondAnswer', {rules: [{ required: true,message: '请设置选项B的答案' }]}]"
            
         />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选项C">
          <a-input
            placeholder="请设置选项C的答案"
            v-decorator="['threeAnswer', {rules: [{ required: true,message: '请设置选项C的答案' }]}]"
           
          />
        </a-form-item>
        
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="正确答案">
          <a-select
            placeholder="请设置正确答案"
            v-decorator="[ 'trueAnswer', {rules: [{ required: true,message: '请设置正确答案' }]}]"
            
          >
            <a-select-option :value="1">A</a-select-option>
            <a-select-option :value="2">B</a-select-option>
            <a-select-option :value="3">C</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="支付密码">
          <a-input-password
            placeholder="请输入支付密码"
            v-decorator="['payPassword', {rules: [{ required: true,message: '请输入支付密码' }]}]"
            :disabled="autoSubmit"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="金额">
          <a-input
            placeholder="请设置金额"
              v-decorator="['totalMoney', {rules: [{ required: true,message: '请设置金额' }, {validator: makeNumber}]}]"
            :disabled="autoSubmit"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参与人数">
          <a-input-number
            :min="1"
            v-decorator="['number', {rules: [{ required: true,message: '请输入参与人数' }]}]"
            :disabled="autoSubmit"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { putAction, postAction, httpAction, getAction } from "@/api/manage";
import pick from "lodash.pick";
import * as qiniu from "qiniu-js";
export default {
  name: "awardAddModal",
  data() {
    return {
      images: "",
      canimg: "", // 课程封面副
      title: "操作",
      selectList: [], // 课程分类列表
      selectList1: [],
      percent: "", // 图片上传进度
      cateName: "", // 分类名称
      cateName1: "", // 分类名称
      userId: null,
      teamName: "",
      dataSource: [], // 选择数据源
      searchParam: "", // 搜索字段
      loading: false,
      type: "",
      autoSubmit: false,
      visible: false,
      // trueAnswer:1,
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
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: "/system/question/add",
        edit: "/system/question/update", //修改问题分类
        selectNewList: "/system/question/category/category-list",
        fileUpload: window._CONFIG["domianQiNiu"], // 七牛云地址
        qiniuToken: "/qiniuUpToken", // 请求七牛云上传的token
        searchUrl: "/system/appuserinfo/getUserBYPhoneOrCodeOrNickName"
      }
    };
  },
  created() {
    getAction(this.url.selectNewList).then(res => {
      if (res.success) {
        this.selectList = res.result;
      } else {
        this.$message.warning(res.message);
      }
    });
  },
  computed: {
    uploadAction: function() {
      return this.url.fileUpload;
    }
  },
  methods: {
    // 类型选择
    typeSelectHandle(value) {
      this.type = value;
      if (this.type == 1) {
        getAction(this.url.selectNewList, { parentId: 1 }).then(res => {
          if (res.success) {
            console.log(res);
            this.selectList = res.result;
          } else {
            this.$message.warning(res.message);
          }
        });
      } else if (this.type == 2) {
        getAction(this.url.selectNewList, { parentId: 2 }).then(res => {
          if (res.success) {
            console.log(res);
            this.selectList1 = res.result;
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
 
    makeNumber(rule, value, callback) {
      if (value < 100 ) {
        callback("金额最少为100v币");
      } else {
        callback();
      }
    },
    handleSearch(value) {
      //   console.log("search", value);
      this.searchParam = value;
    },
    add() {
      this.images = "";
      this.percent = "";
      this.teamName = "";
      this.trueAnswer = "";
      this.confirmLoading = false;
      this.edit({});
    },
    edit(record) {
      console.log(record)
      if (
        record &&
        record.title &&
        record.title !== ""
      ) {
        this.autoSubmit = true;
      } else {
        this.autoSubmit = false;
      }     
      this.images = record.images;
      this.canimg = record.images;
      this.teamName = record.userName;
      this.groupName = record.groupName;
      this.questionId = record.id;
      this.categoryId = record.groupId;
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            "title",
            "images",
            "firstAnswer",
            "secondAnswer",
            "threeAnswer",
            "trueAnswer",
            "totalMoney",
            "number",
            "userName",
            "groupName",
            //  "groupName1",
            "payPassword",
            "userId",
            "questionId",
            "categoryId",
            "parentId"
          )
        );
      });
    },
    close() {
      this.$emit("close");
      this.percent = "";
      this.images = "";
      this.questionId = "";
      this.categoryId = "";
      this.userId = "";
      this.visible = false;
      this.cateName = "";
      this.cateName2 = "";
      this.dataSource = [];
      this.trueAnswer = null;
      this.searchParam = "";
    },
    onSelect(value) {
      this.dataSource.forEach(item => {
        if (item.userId === Number(value)) {
           this.userId = value
           
        }
      });
    },
    //  开始搜索
    beginSearch() {
      getAction(this.url.searchUrl, { searchParam: this.searchParam })
        .then(res => {
          if (res.success) {
            if (res.result.length === 0) {
              this.$message.warning("暂无数据");
            } else {
              this.dataSource = res.result;
            }
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(err => {
          this.$message.warning(err.message);
        });
    },
    cateoryHandle(value) {
      this.selectList.forEach(item => {
        if (item.id === value) {
          this.groupName = item.name;
          this.cateName = item.id;
        }
      });
    },
    cateoryHandle1(value) {
      this.selectList1.forEach(item => {
        if (item.id === value) {
          // this.groupName1 = item.name
          this.groupName = item.name;
          this.cateName = item.id;
          console.log("this.cateName1");
          console.log(this.cateName);
        }
      });
    },
    handleOk() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          // if(this.userId == undefined){
          //   alert("请选择用户")
          // }else{
          that.confirmLoading = true;
          let httpurl = "";
          // let categoryId  = '' ? this.cateName:this.cateName1;
          let formData = Object.assign(this.model, values);
          console.log(formData);
          formData.images = this.images;
          formData.questionId = this.questionId;
          formData.categoryId = this.categoryId;
          formData.userId = this.userId;
          formData.groupName = this.groupName;
          formData.groupName1 = this.groupName1;
          let trueAnswer = formData.trueAnswer;
          if (trueAnswer == 1) {
            formData.trueAnswer = "A";
          } else if (trueAnswer == 2) {
            formData.trueAnswer = "B";
          } else if (trueAnswer == 3) {
            formData.trueAnswer = "C";
          }
          if (!this.model.id) {       
            httpurl += this.url.add;
            let arr = `?categoryId=${this.cateName}&firstAnswer=${formData.firstAnswer}&images=${formData.images}&number=${formData.number}&payPassword=${formData.payPassword}&secondAnswer=${formData.secondAnswer}&threeAnswer=${formData.threeAnswer}&title=${formData.title}&totalMoney=${formData.totalMoney}&trueAnswer=${formData.trueAnswer}&userId=${formData.userId}`;
           arr = encodeURI(arr)
           console.log(arr)
          postAction(httpurl + arr)
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
       
          } else {
            httpurl += this.url.edit;
            let arr = `?firstAnswer=${formData.firstAnswer}&images=${formData.images}&questionId=${formData.questionId}&secondAnswer=${formData.secondAnswer}&threeAnswer=${formData.threeAnswer}&title=${formData.title}&trueAnswer=${formData.trueAnswer}`;
              arr = encodeURI(arr)
             console.log(arr)
            putAction(httpurl + arr)
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
              // location.href = "/vyun/product/awardList"
          }
        }
        // }
      });
    },
    // 图片自定义上传
    imgCustomRequest(data) {
      // 开始转圈圈，上传中
      this.loading = true;
      // 获取文件的后缀名
      const suffix = "." + data.file.name.replace(/^.+\./, "");
      //请求token
      httpAction(this.url.qiniuToken, {}, "post").then(res => {
        if (res) {
          let token = res.data.token;
          const file = data.file;
          const key = new Date().getTime() + suffix;
          let domain = this.url.fileUpload;
          let config = {
            useCdnDomain: true, // 域名加速
            region: null // 不指定具体区域，自动识别
          };
          let putExtra = {
            fname: "",
            params: {},
            mimeType: null
          };

          let observable = qiniu.upload(file, key, token, putExtra, config);
          observable.subscribe({
            next: res => {
              this.percent = res.total.percent.toFixed(2);
              this.images = "";
            },
            error: () => {
              this.$message.error("上传失败");
              this.loading = false;
              this.images = this.canimg;
            },
            complete: response => {
              let allUrl = `${domain}/${response.key}`;
              // 开始转圈圈，上传中
              this.images = allUrl;
              this.loading = false;
            }
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
.ant-input-affix-wrapper .ant-input-suffix {
  right: 1px !important;
}
</style>
