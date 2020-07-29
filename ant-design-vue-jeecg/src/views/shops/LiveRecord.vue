<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="4">
            <a-form-item label="直播标题">
              <a-input placeholder="请输入直播标题" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="用户名称">
              <a-input placeholder="请输入用户名称" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="房间号">
              <a-input placeholder="请输入房间号" v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="直播状态">
              <a-select placeholder="请选择直播状态" v-model="queryParam.state">
                <a-select-option :value="0">关闭</a-select-option>
                <a-select-option :value="1">开启</a-select-option>
                <a-select-option :value="2">封禁</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
            <a-form-item label="房间类型">
              <a-select placeholder="请选择房间类型" v-model="queryParam.type">
                <a-select-option :value="1">公开</a-select-option>
                <a-select-option :value="2">私密</a-select-option>
                <a-select-option :value="3">收费</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
            <a-col :md="4" :sm="4">
            <a-form-item label="用户标识">
              <a-select placeholder="请选择用户标识" v-model="queryParam.marker">
                <a-select-option value="0">测试</a-select-option>
                <a-select-option value="1">正式</a-select-option>
                <a-select-option value="2">官方</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="4">
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
        <a-row style="height:120px">
          <a-col :sm="6" :md="6" :xl="6" :style="{ height:'50px',border:'1px solid gary' }">
            <chart-card
              :bordered="true"
              :loading="loading"
              title="点赞数量"
              :total="this.liveLikeNum.toString()"
            ></chart-card>
          </a-col>
          <a-col :sm="6" :md="6" :xl="6" :style="{ height:'50px',border:'1px solid gary' }">
            <chart-card :loading="loading" title="V钻" :total="this.liveVDiamondMoney.toString()"></chart-card>
          </a-col>
          <a-col :sm="6" :md="6" :xl="6" :style="{ height:'50px',border:'1px solid gary' }">
            <chart-card
              :loading="loading"
              title="观看人数"
              :total="this.liveViewNum.toString()"
            ></chart-card>
          </a-col>
              <a-col :sm="6" :md="6" :xl="6" :style="{ height:'50px',border:'1px solid gary' }">
            <chart-card
              :loading="loading"
              title="交易流水"
              :total="this.streamAmount.toString()"
            ></chart-card>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- <video id="videoElement" class="cover" controls="controls"></video> -->
    <!--  分润 -->
    <!-- 表格区域 -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="header" slot-scope="text">
          <a-avatar
            shape="square"
            size="large"
            :src="text"
            :srcSet="text"
            @click.stop="bigImg(text)"
          ></a-avatar>
        </span>
        <!-- <span slot="templateTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="10"></j-ellipsis>
        </span>-->
        <div slot="templateTitle" slot-scope="text, record">
          <!-- <a :href="text">{{text}}</a> -->
          <a style="width:100px;height:80px;margin:auto;display:block;" @click="click(record)">
            <img :src="text" alt style="width:100%;height:100%" />
          </a>
        </div>
        <template slot="createTime" slot-scope="text, record">
          <span slot="createTime">{{ record.startTime | moment }}</span>
        </template>
        <template slot="endTime" slot-scope="text, record">
          <span slot="endTime">{{ record.endTime | moment }}</span>
        </template>
        <template slot="totalTime" slot-scope="text, record">
          <span slot="totalTime">{{ record.totalTime | SeondFormat }}</span>
        </template>
        <span slot="action" slot-scope="text, record">
          <div v-if="record.mode == 1 && record.state == 1">
            <a-popconfirm title="确定设置为推荐吗?" @confirm="() => HandleSet(record)">
              <a>推荐</a>
            </a-popconfirm>
          </div>
          <div v-else-if="record.mode == 2 && record.state == 1">
            <a-popconfirm title="确定取消推荐吗?" @confirm="() => HandleSet(record)">
              <a>取消</a>
            </a-popconfirm>
          </div>
          <div v-else></div>
        </span>
      </a-table>
    </div>
    <!-- 表单区域 -->
    <!--  图片点击放大  -->
    <product-new-big-img ref="bigImg"></product-new-big-img>
  </a-card>
</template>

<script>
import { postAction, putAction, getAction } from "@/api/manage";
import ChartCard from "@/components/ChartCard";
import ProductNewBigImg from "../product/modules/ProductNewBigImg";
import { JeecgListMixin } from "@/mixins/JeecgListMixin";
import flvjs from "flv.js/dist/flv.min.js";
import JEllipsis from "@/components/jeecg/JEllipsis";
export default {
  name: "LiveRecord",
  mixins: [JeecgListMixin],
  components: {
    ProductNewBigImg,
    JEllipsis,
    ChartCard
  },

  data() {
    return {
      description: "后台直播记录列表",
      dataSource: [],
      liveLikeNum: 0,
      liveVDiamondMoney: 0,
      liveViewNum: 0,
      streamAmount:0,
      player: null,
      columns: [
        {
          title: "用户名称",
          align: "center",
          dataIndex: "nickName"
        },
        {
          title: "房间号",
          align: "center",
          dataIndex: "code"
        },
        {
          title: "直播标题",
          align: "center",
          dataIndex: "title"
        },
        // {
        //   title: "封面图",
        //   align: "center",
        //   dataIndex: "coverImg",
        //   scopedSlots: { customRender: "header" }
        // },
        {
          title: "推流地址",
          align: "center",
          dataIndex: "coverImg",
          scopedSlots: { customRender: "templateTitle" }
        },
        {
          title: "开播时间",
          align: "center",
          dataIndex: "startTime",
          scopedSlots: { customRender: "createTime" }
        },
        {
          title: "结束时间",
          align: "center",
          dataIndex: "endTime",
          scopedSlots: { customRender: "endTime" }
        },
        {
          title: "粉丝数量",
          align: "center",
          dataIndex: "fansNum"
        },
        {
          title: "热度值",
          align: "center",
          dataIndex: "heatValue"
        },
        {
          title: "点赞数",
          align: "center",
          dataIndex: "likeNum"
        },
        {
          title: "V钻",
          align: "center",
          dataIndex: "money"
        },
        {
          title: "交易流水",
          align: "center",
          dataIndex: "streamAmount"
        },
        {
          title: "开播时长",
          align: "center",
          dataIndex: "totalTime",
          scopedSlots: { customRender: "totalTime" }
        },
        {
          title: "状态",
          align: "center",
          dataIndex: "state",
          customRender: function(text) {
            if (text == 0) {
              return "关闭";
            } else if (text == 1) {
              return "开启";
            } else if (text == 2) {
              return "封禁";
            }
          }
        },
        {
          title: "房间类型",
          align: "center",
          dataIndex: "type",
          customRender: function(text) {
            if (text == 1) {
              return "公开";
            } else if (text == 2) {
              return "私密";
            } else if (text == 3) {
              return "收费";
            }
          }
        },
        {
          title: "观看人数",
          align: "center",
          dataIndex: "viewsNum"
        },
        {
          title: "是否推荐",
          align: "center",
          dataIndex: "mode",
          customRender: function(text) {
            if (text == 1) {
              return "否";
            } else if (text == 2) {
              return "是";
            }
          }
        },
         {
          title: "用户标识",
          align: "center",
          dataIndex: "marker",
          customRender: function(text) {
            if (text == 0) {
              return "测试";
            } else if (text == 1) {
              return "正式";
            } else if (text == 2) {
              return "官方";
            }
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
          width: 100
        }
      ],
      url: {
        list: "/system/live/record/list",
        recommend: "/system/live/record/recommend"
      }
    };
  },
  created() {},
  //  created(){
  //   if(flvjs.isSupported()){
  //     this.player = flvjs.createPlayer({
  //       type: 'flv',
  //       isLive: 'true',
  //       url: 'http://5815.liveplay.myqcloud.com/live/5815_89aad37e06ff11e892905cb9018cf0d4_550.flv' //flv文件地址
  //       // url:'',
  //     });
  //   }
  // },
  // mounted() {
  //     var videoElement = document.getElementById('videoElement35200870');
  //     this.player.attachMediaElement(videoElement);
  //     this.player.load()
  // },
  methods: {
    //  图片点击放大
    bigImg(text) {
      if (text) {
        this.$refs.bigImg.make(text);
      }
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error("请设置url.list属性!");
        return;
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams(); //查询条件
      this.loading = true;

      getAction(this.url.list, params).then(res => {
        if (res.success) {
          console.log(res);
          this.dataSource = res.result.pageList.records;
          this.ipagination.total = res.result.pageList.total;
          this.total = res.result.pageList.total;
          this.liveLikeNum = res.result.liveLikeNum;
          this.liveVDiamondMoney = res.result.liveVDiamondMoney;
          this.liveViewNum = res.result.liveViewNum;
          this.streamAmount = res.result.streamAmount;
        }
        if (res.code === 510) {
          this.$message.warning(res.message);
        }
        this.loading = false;
      });
    },
    click(record) {
      console.log(record)
      let that = this;
      if (record.state != 1) {
        alert("当前直播已关闭，请查看其他直播吧~");
      
      }else{
        window.open(
          "http://vyun.dujialive.com/liveplayer/lxPc.html?flv=" +
            record.streamAddrUrl
        );
      }
      

      // window.location.href = "http://127.0.0.1:5501/liveplayer/lx1.html?flv="+record.streamAddrUrl
    },
    HandleSet: function(record) {
      var that = this;
      var mode = record.mode;
      if (mode == 2) {
        var type = 1;
      } else if (mode == 1) {
        var type = 2;
      }
      let arr = `?id=${record.id}&mode=${type}`;

      putAction(that.url.recommend + arr).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          console.log(res);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    }
  }
};
</script>

<style scoped>
@import "~@assets/less/common.less";
.txt {
  height: 30px;
  width: 150px;
}
</style>
