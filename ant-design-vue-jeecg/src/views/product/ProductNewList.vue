<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-item label="课程标题">
              <a-input placeholder="请输入课程标题" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="课程分类">
              <a-select
                placeholder="请选择课程分类"
                v-model="queryParam.category"
                @select="typeSelectHandle"
              >
                <a-select-option
                  v-for="(item, index) in selectList"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8" v-if="this.selectrue == true">
            <a-form-item label="二级分类">
              <a-select placeholder="请选择课程分类" v-model="queryParam.secondCategory">
                <a-select-option
                  v-for="(item, index) in selecBox"
                  @select="cateoryHandle2"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="6">
            <a-form-item label="是否推荐">
              <a-select placeholder="请选择是否推荐" v-model="queryParam.isRecommend">
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="课程作者">
                <a-input placeholder="请输入课程作者" v-model="queryParam.author"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="课程专辑">
                <a-input placeholder="请输入课程专辑" v-model="queryParam.album"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="课程类别">
                <a-input placeholder="请输入课程类别" v-model="queryParam.fistcategory"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
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
          <j-ellipsis :value="text" />
        </span>

        <span slot="action" slot-scope="text, record" @click.stop>
          <!-- 会员可编辑 -->
          <a @click.stop="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <!-- 非会员显示详情 -->
          <a href="javascript:;" @click.stop="handleDetail(record)">详情</a>

          <a-divider type="vertical" />
          <!-- 推荐 -->
          <a-dropdown>
            <a class="ant-dropdown-link">
              推荐
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.firstPage == 's'">
                <a-popconfirm title="确定取消一级推荐吗?" @confirm="() => handleCommen(record.id, 1, 0)">
                  <a>取消一级推荐</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-else>
                <a-popconfirm title="确定设置一级推荐吗?" @confirm="() => handleCommen(record.id, 1, 1)">
                  <a>设置一级推荐</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-if="record.secondPage == 's'">
                <a-popconfirm title="确定取消二级推荐吗?" @confirm="() => handleCommen(record.id, 2, 0)">
                  <a>取消二级推荐</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-else>
                <a-popconfirm title="确定设置二级推荐吗?" @confirm="() => handleCommen(record.id, 2, 1)">
                  <a>设置二级推荐</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a style="color: red">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <product-new-add-modal ref="modalForm" @ok="modalFormOk"></product-new-add-modal>
    <product-new-big-img ref="bigImg"></product-new-big-img>
    <product-new-audit-model ref="auditModel" @ok="modalFormOk"></product-new-audit-model>
  </a-card>
</template>

<script>
import ProductNewAddModal from "./modules/ProductNewAddModal";
// import ProductNewModal from './modules/ProductNewModal'
import ProductNewBigImg from "./modules/ProductNewBigImg";
import ProductNewAuditModel from "./modules/ProductNewAuditModel";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import { getAction } from "@/api/manage";
import JEllipsis from "@/components/jeecg/JEllipsis";

export default {
  name: "ProductNewList",
  mixins: [JeecgListMixin],
  components: {
    JEllipsis,
    ProductNewAddModal,
    // ProductNewModal,
    ProductNewBigImg,
    ProductNewAuditModel
  },
  data() {
    return {
      description: "课程管理页面",
      selectrue: false,
      // 表头
      columns: [
        {
          title: "课程标题",
          align: "center",
          dataIndex: "title",
          scopedSlots: { customRender: "templateTitle" }
        },
        {
          title: "课程简介",
          align: "center",
          dataIndex: "introduction",
          scopedSlots: { customRender: "templateContent" }
        },
        {
          title: "课程作者",
          align: "center",
          dataIndex: "author"
        },
        {
          title: "课程分类",
          align: "center",
          dataIndex: "category"
        },
        {
          title: "课程封面",
          align: "center",
          dataIndex: "coverimg",
          scopedSlots: { customRender: "avatar" }
        },
        {
          title: "浏览次数",
          align: "center",
          dataIndex: "clickcount"
        },
        {
          title: "发布日期",
          align: "center",
          dataIndex: "createTime"
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" }
        }
      ],
      selectList: [],
      selecBox: [],
      url: {
        list: "/product/productNew/list",
        delete: "/product/productNew/delete",
        //查询分类接口
        selectNewList: "/product/productCategory/queryFirstSelect",
        auditTrue: "/product/productNew/auditTrue", //审核通过
        commen: "/product/productNew/recommended", // 推荐设置
        querySecondSelect:"/product/productCategory/querySecondSelect"
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
    typeSelectHandle(value) {
      this.selectList.forEach(item => {
        if (item.id === value) {
          this.cateName = item.name;
          console.log(item.id);
        }
      });

      this.fatherId = value;
      getAction(this.url.querySecondSelect, { fatherId: this.fatherId }).then(
        res => {
          if (res.success) {
            console.log(res.result);
            if (res.result != "") {
              this.selecBox = res.result;
              this.selectrue = true;
              console.log(this.selecBox);
            } else {
              this.selectrue = false;
            }
          } else {
            this.$message.warning(res.message);
          }
        }
      );
    },
    cateoryHandle2(value) {
      console.log(value);
      this.selectList.forEach(item => {
        if (item.id === value) {
          this.cateName = item.name;
          console.log(item.id);
        }
      });
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
    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
    //  审核通过，请求接口
    handleAuditTrue(id) {
      if (!this.url.auditTrue) {
        this.$message.error("请设置审核属性!");
        return;
      }
      var that = this;
      getAction(this.url.auditTrue, { id: id }).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },

    //  审核拒绝，弹出框=>拒绝理由
    handleShenJu(id) {
      this.$refs.auditModel.open(id);
    },
    //  推荐设置
    handleCommen(id, level, set) {
      let arr = {
        id: id,
        level: level,
        set: set
      };
      const that = this;
      getAction(this.url.commen, arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
        } else {
          that.$message.warning(res.message);
        }
        that.loadData();
      });
    }
  }
};
</script>
<style scoped>
@import "~@assets/less/common.less";
</style>
