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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品名称">
            <a-input
              placeholder="请输入商品名称"
              v-decorator="['name', {rules: [{ required: true,message: '请输入商品名称' }]}]"
            />
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item
            v-if="!autoSubmit"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="用户昵称"
          >
            <a-auto-complete
              class="global-search"
              @select="onSelect"
              @search="handleSearch"
              optionLabelProp="text"
              v-decorator="['userId',{ rules: [{required: true,message: '请选择用户'}] }]"
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
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品价格">
            <a-input
              placeholder="输入的价格不能超过8位(数字)"
              v-decorator="['money', {rules: [{ required: true,message: '输入的价格不能超过8位' }]}]"
            />
          </a-form-item>
        </a-row>
        <a-form-item v-if="!autoSubmit" :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品来源">
          <a-select placeholder="请选择商品来源" :disabled="autoSubmit"
          v-decorator="['source', {rules: [{ required: true,message: '请选择商品来源' }]}]"
          >
            <a-select-option :value="1">商城</a-select-option>
            <a-select-option :value="2">商家</a-select-option>
          </a-select>
        </a-form-item>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上传图片"         
          >
            <div class="upload_html"  style="position: relative;">
              <a-upload
             
                accept="image/*"
                :showUploadList="false"              
                :supportServerRender="true"
                :customRequest="fileCustomRequest"
              >            
                <img @click="changeIndex(0)" title="图片" src="../../../assets/img.png" />
              </a-upload>
               <a-icon
                    type="minus-circle"
                    :style="{ fontSize: '20px', color: '#C53A06', position: 'absolute', top: '10px', right: '30px' }"
                    @click="delHandle"
                    v-if="contentList.length>0"
                  />
              <div v-for="(item, index) in contentList" :key="index">             
                <!-- 图片 -->
                <img
                  :src="item.url"
                  style="max-width: 500px;"                                
                />
                <div class="upload_html">
                  <a-upload
                    accept="image/*"
                    :showUploadList="false"
                    :supportServerRender="true"
                    :customRequest="fileCustomRequest"
                  >
                    <img
                      @click="changeIndex(index+1)"
                      title="图片"
                      src="../../../assets/img.png"
                    />
                  </a-upload>
                      <a-icon
                      type="minus-circle"
                      :style="{ fontSize: '20px', color: '#C53A06', position: 'absolute', top: '10px', right: '30px' }"
                      @click="delHandle(index+1)"
                      v-if="index<contentList.length-1"
                    />
                </div>
              </div>
            </div>
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="库存">
            <a-input
              placeholder="请输入整数"
              v-decorator="['stock', {rules: [{ required: true,message: '请输入整数' },{validator: makeKu}]}
              ]"
            />
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="一级返佣">
            <a-input
              placeholder="请输入一级返佣"
              v-decorator="['firstRebate', {rules: [{ required: true,message: '请输入一级返佣' }, {validator: makeNumber}]}
              ]"
               style="width:450px;"
            />
             <span style="margin-left:5px">(%)</span>
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="二级返佣">
            <a-input
              placeholder="请输入二级返佣"
              v-decorator="['secondRebate', {rules: [{ required: true,message: '请输入二级返佣' }, {validator: makeNumber}]}
              ]"
              style="width:450px;"
            />
            <span style="margin-left:5px">(%)</span>
          </a-form-item>
        </a-row>
        <a-row :lg="8">
          <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" label="上架">
          <a-select placeholder="请选择是否上架" 
          v-decorator="['shelvesState', {rules: [{ required: true,message: '请选择是否上架' }]}]"
          >
            <a-select-option :value="0">否</a-select-option>
            <a-select-option :value="1">是</a-select-option>
          </a-select>
        </a-form-item>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import Vue from "vue";
import JCodeEditor from "@/components/jeecg/JCodeEditor";
import JEditor from "@/components/jeecg/JEditor";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { putAction, postAction, httpAction, getAction } from "@/api/manage";
import pick from "lodash.pick";
import * as qiniu from "qiniu-js";
export default {
  name: "InformationModals",
  data() {
    return {
      source: 1,
      userId: null,
      autoSubmit: false,
      contentList: [],
      visible: false,
       content: '',
      icon: "",
      dataSource: [],
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
        add: "/system/mall/goods/add",
        edit: "/system/mall/goods/update", //修改问题分类,
        searchUrl: "/system/appuserinfo/getUserBYPhoneOrCodeOrNickName",
        fileUpload: window._CONFIG["domianQiNiu"], // 七牛云地址
        qiniuToken: "/qiniuUpToken", // 请求七牛云上传的token
        getbyId:"/system/mall/goods/findListByGoodId"
      },
      components:{
         JCodeEditor,
    JEditor,
      }
    };
  },
  created() {
        const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token };
  },
    computed: {
    uploadAction: function() {
      return this.url.fileUpload;
    }
  },
  methods: {
    add() {
      this.icon = "";
      this.percent = "";
      this.content = '';
      this.confirmLoading = false;
      this.edit({});
    },
        // 删除数据
    delHandle(index) {
      if (!index) {
        this.contentList.splice(0, 1);
      } else {
        this.contentList.splice(index, 1);
      }
      this.$forceUpdate();
    },
    edit(record) {
      this.contentList = [];
      this.isId = record.id;
      console.log(this.contentList)
      if (record && record.id && record.id !== "") {
        this.autoSubmit = true;
        this.getContentModel(record.id);
      } else {
        this.autoSubmit = false;
      }
      this.icon = record.icon;
      this.canimg = record.icon;
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;  
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            "name",
            "money",
            "stock",
            "userId",
            "source",
            "firstRebate",
            "secondRebate",
            "shelvesState"
          )
        );
      });
      
    },

          //获取课程详情
    getContentModel(id) {
      const that = this;
      getAction(this.url.getbyId, { goodId: id }).then(res => {
        if (res.success) {
          let record = res.result;
          if (record.length > 0) {
            this.contentList = res.result;
            this.$forceUpdate();
          } else {
            setTimeout(() => {
              that.makeEdit();
            }, 500);
          }
          console.log(record);
        } else {
          that.$message.warning(res.message);
        }
      });
    },
        // 文件自定义上传
    fileCustomRequest(data) {
      // 上传文件的类型
      const fileType = data.file.type;
      this.confirmLoading = true;
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
              const thisPercent = res.total.percent.toFixed(2);
              this.filePercent = thisPercent + "%";
            },
            error: () => {
              this.$message.error("上传失败");
              this.confirmLoading = false;
              this.filePercent = "";
            },
            complete: response => {
              let allUrl = `${domain}/${response.key}`;
              //  否则为视频资源
              const coverimg = allUrl;
               
                const dataCon = {
                  type: this.thisType,
                  timeurl: "",
                  title: "",
                  url: coverimg
                };
                this.contentList.splice(this.thisIndex, 0, dataCon);
                this.$forceUpdate();
              

              this.confirmLoading = false;
              this.filePercent = "";
            }
          });
        }
      });
    },
      changeIndex(index) {
      this.thisIndex = index;
      console.log(this.thisIndex)
    },
    onSelect(value) {
      this.dataSource.forEach(item => {
        if (item.userId === Number(value)) {
          this.userId = value;
        }
      });
    },
    handleSearch(value) {
      //   console.log("search", value);
      this.searchParam = value;
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
      makeKu(rule, value, callback) {
        var re = /^-[0-9]*[1-9][0-9]*$/;
          if (re.test(value)) {
        callback("库存必须大于0");
      } else {
        callback();
      }
    },
    // makeLength(rule, value, callback) {
    //   if (value.length > 10) {
    //     callback("输入字符限制，请重新输入");
    //   } else {
    //     callback();
    //   }
    // },
    makeMax(rule,value,callback){
         if (value.length > 8) {
        callback("商品价格最大支持八位");
      } else {
        callback();
      }
    },
    makeNumber(rule, value, callback) {
      var re = /^([1-9]\d*|[0]{1,1})$/;

      // var re = '^[0-9]*[1-9][0-9]*$';
      if (!re.test(value)) {
        callback("请输入正整数");
      } else {
        callback();
      }
    },
    close() {
      this.$emit("close");
      this.visible = false;
      this.dataSource = [];
        this.contentList = '';
    },
    // 图片自定义上传
       makeEdit() {
      // 判断详情类型
      let record = this.record;
      let thisHtml = "";
      let typeImgs = [];     
          typeImgs = record.images.split(";");
          for (let i = 0; i < typeImgs.length; i++) {
            thisHtml = `<p><img src="${typeImgs[i]}" /></p>`;
          }
          this.source = thisHtml;

      this.model = Object.assign({}, record);
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
             "name",
            "money",
            "stock",
            "userId",
            "source",
            "firstRebate",
            "secondRebate"
          )
        );
      });
    },
    handleOk() {
      if (!this.isId && !this.userId){
        alert("请选择用户");
        return;
      }
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = "";
          let allData = {};
          let formData = Object.assign(this.model, values);
          formData.icon = this.icon;
          let source = JSON.stringify(this.contentList);  
          console.log(source)
           allData.goods = formData;
           allData.source = source;
          if (this.contentList.length > 0) {
            // httpurl+='?source='+source;
            formData.content = "";
          } else {
            // httpurl+="?source=";
            formData.content = this.content;
          }
          if (!this.model.id) {
            httpurl += this.url.add;
            postAction(httpurl,allData)
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
            // let arr = `?name=${formData.name}&icon=${formData.icon}&phone=${formData.phone}`;
            putAction(httpurl,allData)
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
