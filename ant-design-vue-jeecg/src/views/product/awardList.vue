<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="有奖问答标题">
              <a-input placeholder="请输入有奖问答标题" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="分类类型">
              <a-select
                placeholder="请选择分类类型"
                @select="typeSelectHandle"
                v-model="queryParam.parentId"
              >
                <a-select-option :value="1">VIP用户</a-select-option>
                <a-select-option :value="2">普通用户</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item v-if="type == 1" label="有奖问答分类">
              <a-select
                placeholder="请选择有奖问答分类"
                @dropdownVisibleChange="dropSelect"
                @select="cateoryHandle"
                v-model="queryParam.categoryId"
              >
                <a-select-option
                  v-for="(item, index) in selectList"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item v-else label="有奖问答分类">
              <a-select
                placeholder="请选择有奖问答分类"
                @dropdownVisibleChange="dropSelect"
                @select="cateoryHandle"
                v-model="queryParam.categoryId"
              >
                <!--   @select="cateoryHandle1"   -->
                <a-select-option
                  v-for="(item, index) in selectList1"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
            <a-col :md="4" :sm="4">
            <a-form-item label="状态">
              <a-select
                placeholder="请选择发布状态"
                v-model="queryParam.status"
              >
                <a-select-option :value="0">未发布</a-select-option>
                <a-select-option :value="1">未完成</a-select-option>
                <a-select-option :value="2">已满</a-select-option>
                <a-select-option :value="3">已关闭</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :customRow="clickThenCheck"
      >
        <span slot="avatar" slot-scope="text">
          <a-avatar
            shape="square"
            size="large"
            :src="text"
            :srcSet="text"
            @click.stop="bigImg(text)"
          ></a-avatar>
        </span>
        <span slot="templateTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="10"></j-ellipsis>
        </span>
        <span slot="templateContent" slot-scope="text">
          <j-ellipsis :value="text" :length="120" />
        </span>

        <span slot="action" slot-scope="text, record" @click.stop>
           <a v-if="record.status != 0">
          <a @click.stop="handleEdit1(record)">编辑</a>
           <a-divider type="vertical" />
          </a>
           <a v-else @click.stop="handleEdit1(record)"></a>
          <a-popconfirm title="确定关闭吗?" @confirm="() => haddleClose(record)">
            <a style="color: red">关闭</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-popconfirm title="确定复制吗?" @confirm="() => haddleCopy(record)">
            <a>复制</a>
          </a-popconfirm>
          <a v-if="record.status == 0">
          <a-divider type="vertical" />
          <a @click.stop="handleRelease(record)" >编辑发布</a>
          </a>
          <a v-else></a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <awardAddModal ref="modalForm" @ok="modalFormOk"></awardAddModal>
     <add-realate ref="modalForm1" @ok="modalFormOk"></add-realate>
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <product-new-audit-model ref="auditModel" @ok="modalFormOk"></product-new-audit-model>
  </a-card>
</template>

<script>
import awardAddModal from "./modules/awardAddModal";
import addRealate from "./modules/addRealate";
import ProductNewBigImg from "./modules/ProductNewBigImg";
import ProductNewAuditModel from "./modules/ProductNewAuditModel";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { getAction, putAction, postAction } from "@/api/manage";
import JEllipsis from "@/components/jeecg/JEllipsis";

export default {
  name: "awardList",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    awardAddModal,
    addRealate,
    ProductNewBigImg,
    ProductNewAuditModel
  },
  data() {
    return {
      selectList1: [],
      selectList: [],
      type: "",
      description: "有奖问答列表",
      disableSubmit: false,
      autoSubmit: false,
      // 表头
      columns: [
        {
          title: "有奖问答标题",
          align: "center",
          dataIndex: "title",
          scopedSlots: { customRender: "templateTitle" }
        },
        {
          title: "封面",
          align: "center",
          dataIndex: "images",
          scopedSlots: { customRender: "avatar" }
        },
        {
          title: "有奖问答分类",
          align: "center",
          dataIndex: "groupName"
        },
        {
          title: "选项A答案",
          align: "center",
          dataIndex: "firstAnswer",
          scopedSlots: { customRender: "templateTitle" }
        },
        {
          title: "选项B答案",
          align: "center",
          dataIndex: "secondAnswer",
          scopedSlots: { customRender: "templateTitle" }
        },
        {
          title: "选项C答案",
          align: "center",
          dataIndex: "threeAnswer",
          scopedSlots: { customRender: "templateTitle" }
        },
        {
          title: "正确答案",
          align: "center",
          dataIndex: "trueAnswer"
        },
        {
          title: "v币总金额",
          align: "center",
          dataIndex: "totalMoney"
        },
        {
          title: "参与人数",
          align: "center",
          dataIndex: "number"
        },
        {
          title: "单人v币金额",
          align: "center",
          dataIndex: "money"
        },
        {
          title: "回答人数",
          align: "center",
          dataIndex: "answerCount"
        },

        {
          title: "发布日期",
          align: "center",
          dataIndex: "createTime"
        },
        {
          title: "状态",
          align: "center",
          dataIndex: "status",
          customRender: function(text) {
            if (text == 1) {
              return "未完成";
            } else if (text == 2) {
              return "已满";
            } else if (text == 3) {
              return "已关闭";
            } else if (text == 0) {
              return "未发布";
            }
          }
        },

        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      selectList: [],
      url: {
        list: "/system/question/list",
        close: "/system/question/close",
        //查询分类接口
        selectNewList: "/system/question/category/category-list",
        copy: "/system/question/copy",
        release: "/system/question/release"
      }
    };
  },
  created() {
    //获取分类查询数据
    getAction(this.url.selectNewList).then(res => {
      if (res.success) {
        console.log("res");
        console.log(res);
        this.selectList = res.result;
      } else {
        this.$message.warning(res.message);
      }
    });
  },
  methods: {
    handleEdit1: function(record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },

    handleRelease: function(record) {
      console.log("编辑发布")
      this.$refs.modalForm1.edit(record);
      this.$refs.modalForm1.title = "编辑发布";
      this.$refs.modalForm1.disableSubmit = false;
    },
    haddleClose(record) {
      let arr = `?questionId=${record.id}`;
      const that = this;
      putAction(this.url.close + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
        } else {
          that.$message.warning(res.message);
        }
        that.loadData();
      });
    },
    haddleCopy(record) {
      let arr = `?id=${record.id}`;
      const that = this;
      postAction(this.url.copy + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
        } else {
          that.$message.warning(res.message);
        }
        that.loadData();
      });
    },
    cateoryHandle(value) {
      this.selectList.forEach(item => {
        if (item.id === value) {
          this.groupName = item.name;
          this.cateName = item.id;
          console.log("this.cateName");
          console.log(this.cateName);
        }
      });
    },
    dropSelect() {
      if (!this.type || this.type === "") {
        this.$message.warning("请先选择分类类型!");
      }
    },

    //   cateoryHandle1(value) {
    //   this.selectList.forEach(item => {
    //     if (item.id === value) {
    //       this.groupName = item.name
    //       this.cateName = item.id;
    //     }

    //   });
    // },
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
    clickThenCheck(record) {
      return {
        on: {
          click: () => {
            this.$refs.modalForm.edit(record);
            this.$refs.modalForm.title = "详情";
            this.$refs.modalForm.disableSubmit = true;
          }
        }
      };
    },
    handleDelete1: function(id) {
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!");
        return;
      }
      var that = this;
      deleteAction(that.url.delete, { categoryId: id }).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },

    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
