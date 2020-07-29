<template>
  <a-modal
    :title="title"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading" :tip="filePercent">
      <a-form :form="form">
        <a-row class="form-row" :gutter="10">
          <a-col :lg="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="课程标题">
              <input
                placeholder="请输入课程标题"
                v-decorator="['title', {rules: [{ required: true,message: '请输入课程标题' }]}]"
                :read-only="disableSubmit"
                style="width:245px;height:32px;border-radius:5px;border:1px solid rgb(217,217,217)"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="课程分类">
              <a-select
                placeholder="请选择课程分类"
                @select="cateoryHandle"
                v-decorator="['fistcategory', {rules: [{ required: true,message: '请选择课程分类' }]}]"
                :disabled="disableSubmit"
              >
                <a-select-option
                  v-for="(item, index) in selectList"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
           <a-col :lg="8" v-if="this.selectrue == true">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label=" 二级分类">
              <a-select
                placeholder="请选择二级分类"
                 @select="cateoryHandle2"
                v-decorator="['secondcategory', {rules: [{ required: true,message: '请选择二级分类' }]}]"
                :disabled="disableSubmit"
              >
                <a-select-option
                  v-for="(item, index) in selecBox"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-else></a-col>
          <a-col :lg="8">
            <span style="position: absolute;top: 20%;color: red;left: -2px;">*</span>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="课程作者">
              <a-input placeholder v-model="authorName" readonly @click="chooseAuthor" />
            </a-form-item>
          </a-col>
          <a-col :lg="7">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="课程专辑">
              <a-select
                style="margi-left:5px"
                placeholder="请选择课程专辑"
                @dropdownVisibleChange="dropSelect"
                @select="vipSelectHandle"
                v-decorator="['album', {rules: [{ required: true,message: '请选择课程专辑' }]}]"
                :disabled="disableSubmit"
              >
                <a-icon slot="suffixIcon" type="plus" @click.stop="addAlbum" v-if="!disableSubmit" />
                <a-select-option
                  v-for="(item) in albumList"
                  :key="item.albumid"
                  :value="item.albumid"
                >{{ item.albumname }}</a-select-option>
              </a-select>
              <!--              <a-input placeholder="" v-model="albumName" :read-only="disableSubmit" />-->
            </a-form-item>
          </a-col>
          <a-col :lg="7">
            <a-form-item
              style="width:330px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="课程类型"
            >
              <a-select
                style="margin-left:10px;width:210px"
                placeholder="请选择课程类型"
                @select="typeSelectHandle"
                v-decorator="['type', {rules: [{ required: true,message: '请选择课程类型' }]}]"
                :disabled="disableSubmit"
              >
                <a-select-option :value="1">免费</a-select-option>
                <a-select-option :value="3">付费</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="课程价格"
              v-if="type === 3"
            >
              <a-input-number
                placeholder="请输入课程价格"
                v-decorator="['price', {rules: [{ required: true,message: '请输入课程价格' }, { validator: priceValidator }]}]"
                :disabled="disableSubmit"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="10">
            <a-form-item label="发布时间" v-if="autodispaly">
              <a-date-picker
                showTime
                style="width: 280px;position:absolute;top:-35px;left:75px"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="[ 'createTime', {rules: [{ required: true,message: '请选择发布时间' }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="7">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-if="autodispaly"
              label="浏览次数"
            >
              <a-input
                placeholder="请输入浏览次数"
                v-decorator="['clickcount', {} ]"
                :read-only="disableSubmit"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="24">
            <a-form-item :labelCol="labelColk" :wrapperCol="wrapperColk" label="课程简介">
              <input
                placeholder="请输入课程简介"
                v-decorator="['introduction', {} ]"
                :read-only="disableSubmit"
                style="width:920px;height:32px;border-radius:5px;border:1px solid rgb(217,217,217)"
              />
            </a-form-item>
          </a-col>
          <!-- 详情页 -->
          <a-col :lg="24" v-show="disableSubmit">
            <span style="position: absolute;top: 11px;color: red;left:10px;">*</span>
            <a-form-item :labelCol="labelColk" :wrapperCol="wrapperColk" label="课程详情">
              <!-- 老数据，富文本格式 -->
              <div
                class="vipmodal_content"
                v-if="contentList.length === 0"
                v-html="content"
                style="border: 1px solid #ccc;padding: 20px;border-radius: 5px;"
              ></div>
              <!-- 新数据，source格式 -->
              <div
                class="vipmodal_content"
                v-else
                style="border: 1px solid #ccc;padding: 20px;border-radius: 5px;"
              >
                <div v-for="(item, index) in contentList" :key="index">
                  <p>
                    <strong v-if="item.title && item.title !== ''">{{ item.title }}</strong>
                  </p>
                  <!-- 文本 -->
                  <p v-if="item.type === 'text'">{{ item.url }}</p>
                  <!-- 图片 -->
                  <img
                    :src="item.url"
                    style="max-width: 500px;"
                    :alt="item.title"
                    v-if="item.type === 'img'"
                  />
                  <!-- 视频 -->
                  <div v-if="item.type === 'video'" style="margin-top: 20px;">
                    <div v-if="item.timeurl && item.timeurl !== ''">
                      <a
                        :href="item.url"
                        target="_blank"
                        :style="'display:block;width:300px;height:150px;background-image:url('+item.timeurl+');background-size: 100% 100%;background-size:cover;background-position: center center;position:relative;'"
                      >
                        <img
                          src="~@assets/play.png"
                          alt
                          style="position: absolute;width: 50px;height: 50px;top: 50%;left: 50%;transform: translate(-50%,-50%);"
                        />
                      </a>
                    </div>
                    <video controls="controls" v-else width="300" height="150">
                      <source :src="item.url" />
                    </video>
                  </div>

                  <!--                  <p v-if="item.type === 'video' && item.timeurl && item.timeurl !== ''">视频第一帧: <br>-->
                  <!--                    <img :src="item.timeurl" style="max-width: 200px;" :alt="item.title" v-if="item.type === 'video'">-->
                  <!--                  </p>-->
                  <!-- 音频 -->
                  <audio v-if="item.type === 'audio'" :src="item.url" controls="controls"></audio>
                </div>
              </div>
            </a-form-item>
          </a-col>
          <a-col :lg="24" v-show="!disableSubmit">
            <a-form-item
              :labelCol="labelColk"
              :wrapperCol="wrapperColk"
              :required="true"
              label="课程详情"
            >
              <j-editor
                v-if="contentList.length === 0 && title !== '新增'"
                v-model="content"
                :disabled="disableSubmit"
              ></j-editor>
              <div
                v-else
                class="vipaddmodal_content"
                style="border: 1px solid #ccc;padding: 10px 20px;border-radius: 5px;"
              >
                <div class="upload_html">
                  <a-upload
                    accept="image/*"
                    :showUploadList="false"
                    :supportServerRender="true"
                    :customRequest="fileCustomRequest"
                  >
                    <img @click="changeIndex(0,'img')" title="图片" src="../../../assets/img.png" />
                  </a-upload>
                  <span>
                    <img @click="addFile('text')" title="文本" src="../../../assets/text.png" />
                  </span>
                  <span>
                    <img @click="changeIndex(0,'video')" title="视频" src="../../../assets/video.png" />
                  </span>

                  <a-upload
                    accept="audio/*"
                    :showUploadList="false"
                    :supportServerRender="true"
                    :customRequest="fileCustomRequest"
                  >
                    <img @click="changeIndex(0,'audio')" title="音频" src="../../../assets/audio.png" />
                  </a-upload>

                  <a-icon
                    type="minus-circle"
                    :style="{ fontSize: '20px', color: '#C53A06', position: 'absolute', top: '10px', right: '30px' }"
                    @click="delHandle"
                    v-if="contentList.length>0"
                  />
                </div>
                <div v-for="(item, index) in contentList" :key="index">
                  <p>
                    <strong v-if="item.title && item.title !== ''">{{ item.title }}</strong>
                  </p>
                  <!-- 文本 -->
                  <textarea
                    v-model="item.url"
                    :rows="5"
                    v-if="item.type === 'text'"
                    style="width:800px"
                  ></textarea>
                  <!-- 图片 -->
                  <img
                    :src="item.url"
                    style="max-width: 500px;"
                    :alt="item.title"
                    v-if="item.type === 'img'"
                  />
                  <!-- 视频 -->
                  <div v-if="item.type === 'video'">
                    <div v-if="item.timeurl && item.timeurl !== ''">
                      <a
                        :href="item.url"
                        target="_blank"
                        :style="'display:block;width:300px;height:150px;background-image:url('+item.timeurl+');background-size: 100% 100%;background-size:cover;background-position: center center;position:relative;'"
                      >
                        <img
                          src="~@assets/play.png"
                          alt
                          style="position: absolute;width: 50px;height: 50px;top: 50%;left: 50%;transform: translate(-50%,-50%);"
                        />
                      </a>
                    </div>
                    <video controls="controls" v-else width="300" height="150">
                      <source :src="item.url" />
                    </video>
                  </div>
                  <!--                  <video controls="controls" v-if="item.type === 'video'" width="300" height="150"><source :src="item.url" /></video>-->
                  <!--                  <p v-if="item.type === 'video' && item.timeurl && item.timeurl !== ''">视频第一帧: <br>-->
                  <!--                    <img :src="item.timeurl" style="max-width: 200px;" :alt="item.title" v-if="item.type === 'video'">-->
                  <!--                  </p>-->
                  <!-- 音频 -->
                  <audio v-if="item.type === 'audio'" :src="item.url" controls="controls"></audio>

                  <div class="upload_html">
                    <a-upload
                      accept="image/*"
                      :showUploadList="false"
                      :supportServerRender="true"
                      :customRequest="fileCustomRequest"
                    >
                      <img
                        @click="changeIndex(index+1,'img')"
                        title="图片"
                        src="../../../assets/img.png"
                      />
                    </a-upload>
                    <span>
                      <img
                        @click="addFile('text', index+1)"
                        title="文本"
                        src="../../../assets/text.png"
                      />
                    </span>
                    <span>
                      <img
                        @click="changeIndex(index+1,'video')"
                        title="视频"
                        src="../../../assets/video.png"
                      />
                    </span>

                    <a-upload
                      accept="audio/*"
                      :showUploadList="false"
                      :supportServerRender="true"
                      :customRequest="fileCustomRequest"
                    >
                      <img
                        @click="changeIndex(index+1,'audio')"
                        title="音频"
                        src="../../../assets/audio.png"
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
          </a-col>
        </a-row>
        <a-form-item label="课程封面" :labelCol="labelColk" :wrapperCol="wrapperColk">
          <a-upload
            accept="image/*"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :supportServerRender="true"
            :customRequest="imgCustomRequest"
            :disabled="disableSubmit"
            v-decorator="['coverimg', {rules: [{ required: true,message: '请上传课程封面' }]} ]"
          >
            <img v-if="coverimg" :src="coverimg" alt="avatar" style="max-width: 150px;" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text" v-if="!loading">Upload</div>
              <div class="ant-upload-text" v-if="loading">{{ percent }}%</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
    <!--  添加专辑  -->
    <product-add-album-modal ref="addAblumModal" @ok="modalFormOk"></product-add-album-modal>
    <!--  选择作者  -->
    <associated-modal ref="assModalForm" @ok="assFormOk"></associated-modal>
    <!-- 详情添加视频 -->
    <product-vip-add-img ref="addImgModal" @ok="VideoFromOK"></product-vip-add-img>
  </a-modal>
</template>

<script>
import Vue from "vue";
import { filterObj, formatDate } from "@/utils/util";
import { httpAction, getAction } from "@/api/manage";
import moment from "moment";
import pick from "lodash.pick";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import ProductAddAlbumModal from "./ProductAddAlbumModal";
import JCodeEditor from "@/components/jeecg/JCodeEditor";
import JEditor from "@/components/jeecg/JEditor";
import AssociatedModal from "../../system/modules/AssociatedModal";
import ProductVipAddImg from "./ProductVipAddImg"; // 添加视频
import * as qiniu from "qiniu-js";

export default {
  name: "ProductNewAddModal",
  data() {
    return {
      title: "操作",
      visible: false,
      model: {},
      userId: "",
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      labelColk: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperColk: {
        xs: { span: 24 },
        sm: { span: 21 }
      },
      loading: false,
      autodispaly: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      coverimg: "", // 课程封面
      canimg: "", // 课程封面副
      percent: "", // 图片上传进度
      filePercent: "", // 文件资源上传进度
      contentList: [],
      selecBox:[],
      selectrue:false,
      thisIndex: 0,
      thisType: "",
      disableSubmit: false,
      albumList: [], // 专辑列表
      content: "", // 详情
      headers: {}, // 文件上传的请求头
      selectList: [], // 课程分类列表
      albumName: "", //专辑名称
      albumNum: "", //专辑id
      author: "", // 作者id
      authorName: "", //作者名称
      cateName: "", // 分类名称
      record: {}, // 老数据的资源详情
      type: 0, // 课程类型
      fatherId:null,
      validatorRules: {},
      url: {
        add: "/product/productNew/addProduct", // 课程新增接口
        edit: "/product/productNew/editProduct", // 课程编辑接口
        getbyId: "/product/productNew/queryById", // 根据课程id获取课程详情
        findList: "/product/productsource/findListByProductId", // 课程资源详情
        selectNewList: "/product/productCategory/queryFirstSelect", //分类选择
        querySecondSelect:"/product/productCategory/querySecondSelect",
        albumlist: "/user/album/findAlbumSelectByUserId", // 专辑
        // fileUpload: window._CONFIG['domianURL']+"/fileupload",  //图片上传
        userList: "/sys/user/getUserList", //作者列表
        fileUpload: window._CONFIG["domianQiNiu"], // 七牛云地址
        qiniuToken: "/qiniuUpToken" // 请求七牛云上传的token
      }
    };
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token };
    // 获取课程分类
    getAction(this.url.selectNewList).then(res => {
      console.log(res)
      if (res.success) {
        this.selectList = res.result;
      } else {
        this.$message.warning(res.message);
      }
    });
  },

  components: {
    JCodeEditor,
    JEditor,
    ProductAddAlbumModal,
    ProductVipAddImg, // 添加图片
    AssociatedModal // 选择作者弹框
  },

  computed: {
    uploadAction: function() {
      return this.url.fileUpload;
    }
  },
  methods: {
    add() {
      this.coverimg = "";
      this.content = "";
      // this.selectrue = false;
      this.confirmLoading = false;
      this.albumList = [];
      this.author = "";
      this.percent = "";
      this.edit({});
    },
    edit(record) {
      this.type = 0;
      this.coverimg = record.coverimg;
      this.canimg = record.coverimg;
      this.contentList = [];
      this.form.resetFields();
      this.visible = true;
      if (record.id) {
        this.autodispaly = true;
        this.userId = record.id;
        this.getNewModel(record.id);
        this.getContentModel(record.id);
      } else {
        this.autodispaly = false;
        this.model = Object.assign({}, record);
        this.$nextTick(() => {
          this.form.setFieldsValue(
            pick(
              this.model,
              "title",
              "introduction",
              "price",
              "type",
              "fistcategory",
              "secondcategory",
              "content",
              "coverimg",
              "album",
              "createTime",
              "clickcount"
            )
          );
        });
      }
    },
    changeIndex(index, type) {
      this.thisIndex = index;
      this.thisType = type;
      console.log(this.thisIndex);
      if (type === "video") {
        this.$refs.addImgModal.show();
      }
    },
    // 点击添加数据
    addFile(type, index) {
      console.log("index" + index);
      const dataCon = {
        type: type,
        timeurl: "",
        title: "",
        url: ""
      };
      if (!index) {
        this.contentList.splice(0, 0, dataCon);
      } else {
        this.contentList.splice(index, 0, dataCon);
      }
      this.$forceUpdate();
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
    //选择作者
    chooseAuthor() {
      if (!this.disableSubmit) {
        this.$refs.assModalForm.show();
      }
    },
    //接收选择的作者数据
    assFormOk(value) {
      console.log(value);
      this.authorName = value.authorName;
      this.author = value.author;
      // 根据选择的作者获取专辑
      this.getAblum(this.author);
    },
    // 专辑选择下拉菜单 展开
    dropSelect() {
      if (!this.author || this.author === "") {
        this.$message.warning("请先选择课程作者!");
      }
    },
    //获取课程专辑
    getAblum(userId) {
      httpAction(this.url.albumlist + "?userId=" + userId, {}, "POST").then(
        res => {
          if (res.success) {
            this.albumList = res.result;
          } else {
            this.$message.warning(res.message);
          }
        }
      );
    },
    // 课程分类选择
    cateoryHandle(value) {
      this.selectList.forEach(item => {
        
        if (item.id === value) {
          this.cateName = item.name;
          console.log(item.id)
        }
      });
      
      this.fatherId = value;
        getAction(this.url.querySecondSelect, { fatherId: this.fatherId}).then(res => {
          if (res.success) {
            console.log(res.result);
          if(res.result != ""){
            this.selecBox = res.result;
            this.selectrue = true;
            console.log(this.selecBox)
          }else{
            this.selectrue = false;
          }
          } else {
            this.$message.warning(res.message);
          }
        });
    },
    cateoryHandle2(value){
      console.log(value)
    this.selectList.forEach(item => {
        if (item.id === value) {
          this.cateName = item.name;
           console.log(item.id)
        }
      });
    },
    // 专辑选择
    vipSelectHandle(value) {
      this.albumList.forEach(item => {
        if (item.albumid === value) {
          this.albumName = item.albumname;
        }
      });
    },
    // 类型选择
    typeSelectHandle(value) {
      this.type = value;
    },
    // 价格的大小校验

    priceValidator(rule, value, callback) {
      if (value && value >= 1) {
        callback();
      } else {
        callback("价格不能小于1");
      }
    },
    // 根据id获取具体数据
    getNewModel(id) {
      const that = this;
      getAction(this.url.getbyId, { id: id }).then(res => {
        if (res.success) {
          let record = res.result.product;
          console.log("res.result.product");
          console.log(res.result);
          this.albumName = res.result.albumName;
          this.authorName = res.result.authorName;
          this.cateName = res.result.cateName;
          this.author = record.author;
          this.type = record.type;
          this.getAblum(record.author);
          this.record = record;
          this.model = Object.assign({}, record);
          this.$nextTick(() => {
            this.form.setFieldsValue(
              pick(
                this.model,
                "title",
                "introduction",
                "price",
                "type",
                "fistcategory",
                "secondcategory",
                "content",
                "coverimg",
                "album",
                "createTime",
                "clickcount"
              )
            );
            //  this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime):null})
          });
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    makeEdit() {
      // 判断详情类型
      //类型1纯文字、2纯图片、3纯视频、4纯音频、5图文、6视频与图文、7音频与图文
      let record = this.record;
      let contentType = record.contentType;
      let thisHtml = "";
      let typeImgs = [];
      switch (contentType) {
        case 1:
          this.content = record.content;
          break;
        case 2:
          typeImgs = record.images.split(";");
          for (let i = 0; i < typeImgs.length; i++) {
            thisHtml = `<p><img src="${typeImgs[i]}" /></p>`;
          }
          this.content = thisHtml;
          break;
        case 3:
          if (
            this.title === "详情" &&
            record.videoImage &&
            record.videoImage !== ""
          ) {
            thisHtml = `<a href="${
              record.videoUrl
            }" target="_blank" style="display:block;width:300px;height:150px;background-image:url(${
              record.videoImage
            });background-size: 100% 100%;background-size:cover;background-position: center center;position:relative;"><img src="${require("@assets/play.png")}" alt="" style="position: absolute;width: 50px;height: 50px;top: 50%;left: 50%;transform: translate(-50%,-50%);"></a>`;
          } else {
            thisHtml = `<p><video controls="controls" width="300" height="150"><source src="${record.videoUrl}" /></video></p>`;
          }

          this.content = thisHtml;
          break;
        case 6:
          if (
            this.title === "详情" &&
            record.videoImage &&
            record.videoImage !== ""
          ) {
            thisHtml = `<a href="${
              record.videoUrl
            }" target="_blank" style="display:block;width:300px;height:150px;background-image:url(${
              record.videoImage
            });background-size: 100% 100%;background-size:cover;background-position: center center;position:relative;"><img src="${require("@assets/play.png")}" alt="" style="position: absolute;width: 50px;height: 50px;top: 50%;left: 50%;transform: translate(-50%,-50%);"></a><p>${
              record.content
            }</p>`;
          } else {
            thisHtml = `<p><video controls="controls" width="300" height="150"><source src="${record.videoUrl}" /></video></p><p>${record.content}</p>`;
          }

          // thisHtml = `<p><video controls="controls" width="300" height="150"><source src="${record.videoUrl}" /></video></p>`;
          this.content = thisHtml;
          break;
        case 4:
          thisHtml = `<p><audio src="${record.videoUrl}" controls="controls"></audio></p>`;
          this.content = thisHtml;
          break;
        case 7:
          thisHtml = `<p><audio src="${record.videoUrl}" controls="controls"></audio></p>${record.content}`;
          this.content = thisHtml;
          break;
        case 5:
          this.content = record.content;
          break;
        default:
          break;
      }
      this.model = Object.assign({}, record);
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            "title",
            "introduction",
            "price",
            "type",
            "fistcategory",
            "secondcategory",
            "content",
            "coverimg",
            "album",
            "createTime",
            "clickcount"
          )
        );
        //  this.form.setFieldsValue({createTime:this.model.createTime?moment(this.model.createTime):null})
      });
    },
    //获取课程详情
    getContentModel(id) {
      const that = this;
      getAction(this.url.findList, { productId: id }).then(res => {
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
    close() {
      this.$emit("close");
      this.visible = false;
      this.coverimg = "";
      this.disableSubmit = false;
      this.authorName = "";
      this.albumName = "";
      this.cateName = "";
      this.content = "";
      this.albumNum = ""; //专辑id
      this.author = ""; // 作者id
      this.percent = "";
    },
    handleOk() {
      const that = this;
      if (!this.author) {
        this.$message.error("课程作者不能为空!");
      }
      if (
        (!this.contentList ||
          this.contentList === "" ||
          this.contentList.length === 0) &&
        (!this.content || this.content === "" || this.content === undefined)
      ) {
        this.$message.error("课程详情不能为空!");
      }
      this.contentList.forEach((item, index) => {
        item.sort = index;
      });
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = "";
          let method = "";
          //  formData.createTime = formData.endTime?formData.endTime.format('YYYY-MM-DD HH:mm:ss'):null;
          //  console.log(formData.createTime)
          if (!this.model.id) {
            httpurl += this.url.add;
            method = "post";
          } else {
            httpurl += this.url.edit;
            method = "post";
          }
          let allData = {};
          let formData = Object.assign(this.model, values);
          console.log("formData");
          console.log(formData.createTime);
          if (formData.type === 1) {
            formData.price = 0;
          }
          // formData.createTime = formData.endTime?formData.endTime.format('YYYY-MM-DD HH:mm:ss'):null
          formData.coverimg = this.coverimg;
          // let source = encodeURIComponent(JSON.stringify(this.contentList));
          let source = JSON.stringify(this.contentList);
          // formData.content = this.contentList;
          formData.author = this.author;
          if (this.contentList.length > 0) {
            // httpurl+='?source='+source;
            formData.content = "";
          } else {
            // httpurl+="?source=";
            formData.content = this.content;
          }

          // allData.authorName = this.authorName;
          // allData.albumName = this.albumName;
          // allData.cateName = this.cateName;
          allData.product = formData;
          allData.source = source;
          //时间格式化
          httpAction(httpurl, allData, method)
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
              this.coverimg = "";
              console.log("fname");
              console.log(res);
            },

            error: () => {
              this.$message.error("上传失败");
              this.loading = false;
              this.coverimg = this.canimg;
            },
            complete: response => {
              let allUrl = `${domain}/${response.key}`;
              // 开始转圈圈，上传中
              this.coverimg = allUrl;
              this.loading = false;
            }
          });
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
              console.log(res.total.percent.toFixed(2));
            },
            error: () => {
              this.$message.error("上传失败");
              this.confirmLoading = false;
              this.filePercent = "";
            },
            complete: response => {
              let allUrl = `${domain}/${response.key}`;
              console.log("allUrl");
              console.log(allUrl);
              //  否则为视频资源
              const coverimg = allUrl;
              if (fileType.indexOf("image") < 0) {
                //  视频资源时需要请求接口获取时长
                getAction(allUrl + "?avinfo").then(res => {
                  // 时长
                  let makeDuration = res.format.duration;
                  let thisDuration = this.setDuration(makeDuration);
                  const dataCon = {
                    type: this.thisType,
                    timeurl: thisDuration,
                    title: "",
                    url: coverimg
                  };
                  this.contentList.splice(this.thisIndex, 0, dataCon);

                  this.$forceUpdate();
                });
              } else {
                const dataCon = {
                  type: this.thisType,
                  timeurl: "",
                  title: "",
                  url: coverimg
                };
                this.contentList.splice(this.thisIndex, 0, dataCon);
                console.log("this.contentList");
                console.log(this.contentList);
                this.$forceUpdate();
              }

              this.confirmLoading = false;
              this.filePercent = "";
            }
          });
        }
      });
    },
    // 添加专辑弹出框
    addAlbum() {
      this.$refs.addAblumModal.add();
      this.$refs.addAblumModal.visible = true;
    },
    // 专辑添加成功后重新获取专辑数据
    modalFormOk() {
      this.getAblum(this.author);
    },
    //  视频添加成功
    VideoFromOK(value) {
      this.contentList.splice(this.thisIndex, 0, value);
      this.$forceUpdate();
      console.log("视频添加成功");
    },
    setDuration(dur) {
      // 秒数取整
      let intTime = parseInt(dur);
      let fen = "0";
      let miao = "0";
      // 小于10秒， 格式  00:0_
      if (intTime < 10) {
        return `00:0${intTime}`;
      }
      // 大于10秒小于60秒， 格式   00:_
      if (intTime < 60) {
        return `00:${intTime}`;
      }
      // 大于1分钟小于60分钟  格式  _:_
      if (intTime < 3600) {
        const mins = parseInt(intTime / 60);
        const sec = intTime % 60;
        if (mins < 10) {
          fen = `0${mins}`;
        } else {
          fen = `${mins}`;
        }
        if (sec < 10) {
          miao = `0${sec}`;
        } else {
          miao = `${sec}`;
        }
        return `${fen}:${miao}`;
      }
      // 大于60分钟   格式  _:_:_
      if (intTime >= 3600) {
        let hour = parseInt(intTime / 3600);
        const mins = parseInt((intTime % 3600) / 60);
        const sec = ((intTime % 3600) % 60) % 60;
        if (mins < 10) {
          fen = `0${mins}`;
        } else {
          fen = `${mins}`;
        }
        if (sec < 10) {
          miao = `0${sec}`;
        } else {
          miao = `${sec}`;
        }
        return `${hour}:${fen}:${miao}`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-spin-nested-loading > div > .ant-spin {
  max-height: 100%;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.vipaddmodal_content .upload_html img {
  width: 25px !important;
  margin: 5px;
}
.vipaddmodal_content .upload_html {
  position: relative;
}
</style>
