<!-- 聊天记录 -->
<template>
  <div class="common_chat-wrapper">
    <div class="common_chat-inner">
      <!-- 聊天记录 -->
      <div class="common_chat-main" id="common_chat_main" ref="common_chat_main">
        <div class="common_chat-main-content">
          <div class="inner">
            <div v-for="(item ,index) in chatInfoEn.msgList" :key="index">
              <!-- 系统消息 -->
              <div v-if="item.role=='sys'" class="item sys">
                <!-- 1)文本类型 -->
                <div v-if="item.contentType=='text'" class="text-content">
                  <p>{{item.content}}</p>
                </div>
              </div>
              <!-- 客户、客服 -->
              <div
                v-else
                class="item"
                :class="{ sender: item.role == oprRoleName, receiver: item.role != oprRoleName }"
              >
                <div class="info-wrapper" :class="item.state">
                  <!-- 1)文本类型 -->
                  <div
                    v-if="item.contentType=='text'"
                    class="item-content common_chat_emoji-wrapper-global"
                  >
                    <p class="text" v-html="getqqemojiEmoji(item.content)"></p>
                  </div>
                  <div v-else-if="item.contentType=='list'" class="item-content">
                    <div class="list">
                      <img class="lineImage" src="../../assets/question_line.png" />
                      <div class="list-title">猜你想问这些问题：</div>
                      <main class="imClientInfo-faq-main">
                        <el-collapse v-model="faqSelected" accordion>
                          <el-collapse-item
                            v-for="(faqItem, index) in answerList"
                            :key="index"
                            :name="index"
                            :title="faqItem.question"
                          >
                            <div v-html="faqItem.answers"></div>
                          </el-collapse-item>
                        </el-collapse>
                      </main>
                    </div>
                  </div>
                  <!-- 2)图片类型 -->
                  <div v-else-if="item.contentType=='image'" class="item-content">
                    <img class="img" :src="item.fileUrl" @click="imgViewDialog_show(item)" />
                  </div>
                  <!-- 3)文件类型 -->
                  <div v-else-if="item.contentType=='file'" class="item-content">
                    <div class="file">
                      <i class="file-icon iconfont fa fa-file"></i>
                      <div class="file-info">
                        <p class="file-name">{{getFileName(item.fileName)}}</p>
                        <div class="file-opr">
                          <div v-show="item.state=='success'">
                            <a
                              class="file-download"
                              :href="item.fileUrl"
                              target="_blank"
                              :download="item.fileUrl"
                            >下载</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 4)文本类型 -->
                  <div
                    v-if="item.contentType=='transformServer'"
                    class="item-content common_chat_emoji-wrapper-global"
                  >
                    <p class="text">亲，请问您遇到什么问题了呀？</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部区域 -->
      <div class="common_chat-footer">
        <div>
          <!-- 聊天输入框 -->
          <div class="input-wrapper">
            <!-- <div
              maxlength="500"
              class="inputContent common_chat_emoji-wrapper-global"
              id="common_chat_input"
              contenteditable="true"
              @paste.stop="inputContent_paste"
              @drop="inputContent_drop"
              @keydown="inputContent_keydown"
              @mouseup="inputContent_mouseup"
              @mouseleave="inputContent_mouseup"
            ></div>-->
            <el-input
              id="common_chat_input"
              class="inputContent common_chat_emoji-wrapper-global"
              v-model="input"
              placeholder="有问题找客服"
            ></el-input>
          </div>
          <!-- 发送按钮 -->
          <el-button
            type="text"
            size="small"
            class="send-btn"
            :class="chatInfoEn.state"
            @click="sendText()"
            :disabled="input.length==0"
          ></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import common_chat_emoji from './common_chat_emoji.vue';

export default {
  components: {
    // commonChatEmoji: common_chat_emoji
  },
  props: {
    chatInfoEn: {
      required: true,
      type: Object,
      default: {
        inputContent: "",
        msgList: []
      }
    },
    answerList: {
      required: true,
      type: Array,
      default: []
    },

    oprRoleName: {
      required: true,
      type: String,
      default: ""
    } // 操作者名称；e.g. server:服务端、client:客服端
  },
  data() {
    return {
      inputContent_setTimeout: null, // 输入文字时在输入结束才修改具体内容
      selectionRange: null, // 输入框选中的区域
      shortcutMsgList: [], // 聊天区域的快捷回复列表
      imgViewDialogVisible: false, // 图片查看dialog的显示
      imgViewDialog_imgSrc: "", // 图片查看dialog的图片地址
      faqSelected: "-1",
      input: ""
    };
  },
  computed: {},
  watch: {},
  methods: {
    /**
     * 初始化
     * @param {Object} opts 可选对象
     */
    init: function(opts) {
      var self = this;
      // 初始化状态
      document.getElementById("common_chat_input").innerHTML = "";
      // self.$refs.qqemoji.$data.faceHidden = true;

      // 在线状态
      if (this.chatInfoEn.state == "on") {
        // 1.显示在输入框的内容
        setTimeout(function() {
          // 未断开获取焦点
          document.getElementById("common_chat_input").focus();
          self.setInputContentSelectRange();
          // 设置之前保存的输入框内容
          if (self.chatInfoEn.inputContent) {
            self.setInputDiv(self.chatInfoEn.inputContent);
          }
        }, 200);
      } else {
        document.getElementById("common_chat_input").blur();
      }

      // 2.滚动到底部
      this.$nextTick(function() {
        self.$refs.common_chat_main.scrollTop =
          self.$refs.common_chat_main.scrollHeight;
        document.getElementById("common_chat_input").focus();
      });
    },

    /**
     * 发送文本
     */
    sendText: function() {
      var self = this;
      if (this.$data.input == "") {
        return;
      }
      var msgContent = this.$data.input;
      this.$data.input = "";
      self.setInputContentByDiv();
      this.sendMsg({
        contentType: "text",
        content: msgContent
      });
    },

    didClick: function() {
      var self = this;
      console.log("点击了某个按钮");
    },

    /**
     * 设置输入内容
     * 根据input输入框innerHTML转换为纯文本
     */
    setInputContentByDiv: function() {
      var self = this;
      var htmlStr = document.getElementById("common_chat_input").innerHTML;
      // 1.转换表情为纯文本：<img textanme="[笑]"/> => [笑]
      var tmpInputContent = htmlStr
        .replace(/<img.+text=\"(.+?)\".+>/g, "[$1]")
        .replace(/<.+?>/g, "");

      // 2.设置最长长度
      if (tmpInputContent.length > 500) {
        document.getElementById("common_chat_input").innerHTML = "";
        var value = tmpInputContent
          .substr(0, 499)
          .replace(/\[(.+?)\]/g, function(item, value) {
            return self.$refs.qqemoji.getImgByFaceName(value);
          });
        this.setInputDiv(value);
      }
      // 3.修改store
      this.chatInfoEn.inputContent = tmpInputContent;
    },

    /**
     * 设置input输入框内容
     * @param {String} vlaue 设置的值
     */
    setInputDiv: function(value) {
      if (this.$data.selectionRange == null) {
        document.getElementById("common_chat_input").focus();
        return;
      }
      // 1.设置selectionRange
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(this.$data.selectionRange);
      } else {
        this.$data.selectionRange && this.$data.selectionRange.select();
      }

      // 2.表情转换为img
      value = this.getqqemojiEmoji(value);

      // 3.聊天框中是否选中了文本，若选中文本将被替换成输入内容
      if (window.getSelection) {
        var sel, range;
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          // 1)删除选中的文本(内容)
          range = sel.getRangeAt(0); // 获取鼠标选中的文本区域
          range.deleteContents(); // 删除选中的文本

          // 2)创建以输入内容为内容的DocumentFragment
          var elemnet;
          if (range.createContextualFragment) {
            elemnet = range.createContextualFragment(value);
          } else {
            // 以下代码等同createContextualFragment
            // 创建一个DocumentFragment
            elemnet = document.createDocumentFragment();

            var divEl = document.createElement("div");
            divEl.innerHTML = value;
            // divEl下的元素，依次插入到DocumentFragment
            for (let i = 0, len = divEl.children.length; i < len; i++) {
              elemnet.appendChild(divEl.firstChild);
            }
          }
          // 3)选中文本的位置替换为新输入的内容，并把光标定位到新内容后方
          var lastNode = elemnet.lastChild;
          range.insertNode(elemnet);
          range.setStartAfter(lastNode);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(imgStr);
      }

      // 4.修改inputContent
      this.setInputContentByDiv();
    },

    /**
     * 转换为QQ表情
     */
    getqqemojiEmoji: function(value) {
      if (value == undefined) {
        return;
      }
      var self = this;
      return value.replace(/\[(.+?)\]/g, function(item, value) {
        return self.$refs.qqemoji.getImgByFaceName(value);
      });
    },

    /**
     * 设置input输入框的选择焦点
     */
    setInputContentSelectRange: function() {
      if (window.getSelection && window.getSelection().rangeCount > 0) {
        var selectRange = window.getSelection().getRangeAt(0);
        if (
          selectRange.commonAncestorContainer.nodeName == "#text" &&
          selectRange.commonAncestorContainer.parentElement &&
          selectRange.commonAncestorContainer.parentElement.id ==
            "common_chat_input"
        ) {
          // 选中了输入框内的文本
          this.$data.selectionRange = selectRange;
        } else if (
          selectRange.commonAncestorContainer.id == "common_chat_input"
        ) {
          // 选中了输入框
          this.$data.selectionRange = selectRange;
        }
      }
    },

    /**
     * 输入框的mouseup
     */
    inputContent_mouseup: function(e) {
      this.setInputContentSelectRange();
    },

    /**
     * 输入框的keydown
     */
    inputContent_keydown: function(e) {
      // keyup触发时，绑定的数据还没有被变更，需要进行延后访问
      this.setInputContentSelectRange();
      clearTimeout(this.$data.inputContent_setTimeout);
      this.$data.inputContent_setTimeout = setTimeout(() => {
        this.setInputContentByDiv();
        // 若按了回车，直接发送
        if (e.keyCode == 13) {
          this.sendText();
        }
      }, 1);
    },

    /**
     * 输入框的粘贴
     */
    inputContent_paste: function(e) {
      var self = this;
      var isImage = false;
      if (e.clipboardData && e.clipboardData.items.length > 0) {
        // 1.上传图片
        for (var i = 0; i < e.clipboardData.items.length; i++) {
          var item = e.clipboardData.items[i];
          if (item.kind == "file" && item.type.indexOf("image") >= 0) {
            // 粘贴板为图片类型
            var file = item.getAsFile();
            let formData = new FormData();
            formData.append("uploadFile", file);
            this.$http.uploadFile({
              url: "/upload",
              params: formData,
              successCallback: rs => {
                console.log(file);
                console.log(rs);
                document.getElementById("common_chat_opr_fileUpload").value =
                  "";
                this.sendMsg({
                  contentType: "image",
                  fileName: rs.fileName,
                  fileUrl: rs.fileUrl,
                  state: "success"
                });
              }
            });
            isImage = true;
          }
        }

        // 2.非图片，粘贴纯文本
        if (!isImage) {
          e.stopPropagation();
          e.preventDefault();
          var str = e.clipboardData.getData("text/plain");
          // 转化为纯文字
          var span = document.createElement("span");
          span.innerHTML = str;
          var txt = span.innerText;
          this.setInputDiv(
            txt
              .replace(/\n/g, "")
              .replace(/\r/g, "")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
          );
        }
      }
    },

    /**
     * 文件上传_点击
     */
    fileUpload_click: function(fileType) {
      document.getElementById(
        "common_chat_opr_fileUpload"
      ).onchange = this.fileUpload_change;
      document.getElementById("common_chat_opr_fileUpload").click();
    },

    /**
     * 输入框的拖拽
     */
    inputContent_drop: function(e) {
      var self = this;
      setTimeout(function() {
        self.setInputContentByDiv();
      }, 100);
    },

    /**
     * 发送消息，e.g. 文本、图片、文件
     * @param {Object} msg 消息对象
     */
    sendMsg: function(msg) {
      // console.log("common_chat_sendMsg--", msg);
      var self = this;
      // 1.传递
      this.$emit("sendMsg", {
        msg: msg,
        successCallbcak: function() {
          document.getElementById("common_chat_input").focus();
          self.goEnd();
        }
      });
    },

    /**
     * 传递回调
     */
    chatCallback: function(emitType, data) {
      this.$emit("chatCallback", {
        eventType: emitType,
        data: data
      });
    },

    /**
     * 聊天记录滚动到底部
     */
    goEnd: function() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.common_chat_main.scrollTop = this.$refs.common_chat_main.scrollHeight;
        }, 100);
      });
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  }
};
</script>
<style lang="less">
.common_chat-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  font-size: 12px;
  float: left;
  border: 0px;
  .common_chat-inner {
    width: 100%;
    height: 100%;
    .common_chat-main {
      position: relative;
      height: calc(~"100% - 68px");
      overflow-y: auto;
      overflow-x: hidden;
      .common_chat-main-content {
        position: absolute;
        width: 100%;
        height: 100%;
        & > .inner {
          padding-bottom: 20px;
          .item {
            clear: both;
            overflow: hidden;
          }
          .sys {
            color: #b0b0b0;
            font-size: 12px;
            text-align: center;
            .text-content {
              padding-top: 20px;
            }
            .myd-content {
              .desc {
                margin-top: 18px;
              }
              .text {
                color: #3e3e3e;
                margin-top: 12px;
              }
              .remark {
                margin-top: 10px;
              }
            }
          }
          .receiver,
          .sender {
            margin-top: 10px;
            font-size: 12px;
            .info-wrapper {
              position: relative;
              text-align: left;
              font-size: 12px;
              .item-content {
                padding-top: 0px;
                padding-bottom: 0px;
                position: relative;
                max-width: 310px;
                font-size: 16px;
                .text {
                  line-height: 1;
                  white-space: normal;
                  word-wrap: break-word;
                  word-break: break-all;
                  padding: 1px 24px;
                }
                .list {
                  .lineImage {
                    position: relative;
                    width: 6px;
                    height: 23px;
                    left: 20px;
                    top: 16px;
                  }
                  .list-title {
                    position: absolute;
                    left: 36px;
                    top: 13px;
                    color: #dcaa50;
                    font-size: 22px;
                  }
                  .imClientInfo-faq-main {
                    position: relative;
                    top: 13px;
                    height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding-bottom: 10px;
                    .el-collapse {
                      border: 0px;
                      .el-collapse-item__header {
                        position: relative;
                        padding: 0px 20px;
                        font-size: 16px;
                        background: transparent;
                        color: #333333;
                        &.is-active {
                          color: #dcaa50;
                        }
                        .el-collapse-item__arrow {
                          position: absolute;
                          right: 0px;
                        }
                      }
                      .el-collapse-item__wrap {
                        background: transparent;
                        .el-collapse-item__content {
                          font-size: 12px;
                          color: #959699;
                          padding: 0px 15px 10px;
                        }
                      }
                    }
                  }
                }
                .qqemoji {
                  width: 24px;
                  height: 24px;
                }
                .img {
                  max-width: 320px;
                  max-height: 240px;
                  white-space: normal;
                  word-wrap: break-word;
                  word-break: break-all;
                  padding: 5px;
                  cursor: pointer;
                }
                .file {
                  width: 220px;
                  padding: 10px 8px;
                  margin: 3px;
                  overflow: hidden;
                  background: #fff;
                  border-radius: 5px;
                  .el-button {
                    padding: 0px;
                    font-size: 12px;
                  }
                  .file-info {
                    float: left;
                    padding: 0px 8px;
                    .file-name {
                      width: 160px;
                      display: inline-block;
                      color: #333333;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      line-height: 1.3;
                    }
                  }
                  .file-opr {
                    margin-top: 8px;
                  }
                  .file-icon {
                    float: left;
                    color: #663399;
                    font-size: 40px;
                  }
                  .file-download {
                    color: #00a8d7;
                    cursor: pointer;
                    text-decoration: blink;
                  }
                }
                .preInput {
                  position: relative;
                  color: #8d8d8d;
                  img {
                    height: 15px;
                    position: relative;
                    top: 3px;
                  }
                }
                .issueList {
                  width: 250px;
                  padding: 10px;
                  .title {
                    position: relative;
                    .content {
                      position: absolute;
                      margin-top: -1px;
                      margin-left: 6px;
                    }
                  }
                  .el-collapse-item__wrap {
                    background: transparent;
                  }
                  .el-collapse {
                    border: 0px;
                    margin-top: 8px;
                    margin-bottom: -8px;
                    .el-collapse-item__header {
                      font-size: 13px;
                      background: transparent;
                      color: #f7455d;
                      padding-left: 5px;
                    }
                    .el-collapse-item__wrap {
                      .el-collapse-item__content {
                        font-size: 12px;
                        color: #3e3e3e;
                        padding-left: 5px;
                      }
                    }
                  }
                }
                .issueExtend {
                  width: 250px;
                  padding: 10px 10px 0px;
                  .main {
                    border-top: 1px solid #eeeff0;
                    margin-top: 10px;
                    padding-top: 10px;
                    p {
                      margin-bottom: 5px;
                    }
                    .el-button {
                      font-size: 12px;
                      color: #f7455d;
                    }
                  }
                }
                .issueResult {
                  width: 250px;
                  .main {
                    padding: 10px;
                  }
                  .footer {
                    border-top: 1px solid #eeeff0;
                    height: 30px;
                    .btn {
                      width: 60px;
                      margin: 0px 30px;
                      padding: 6px 0px;
                      display: inline-block;
                      text-align: center;
                      font-size: 10px;
                      color: #8d8d8d;
                      cursor: pointer;
                      position: relative;
                      &:first-child::after {
                        top: 4px;
                        right: -30px;
                        width: 1px;
                        height: 80%;
                        content: "";
                        position: absolute;
                        background-color: #eeeff0;
                        z-index: 0;
                      }
                    }
                    .iconfont {
                      font-size: 10px;
                      margin-right: 5px;
                    }
                  }
                }
              }
            }
          }
          .item.receiver {
            margin-left: 16px;
            .avatar-wrapper {
              margin-right: 16px;
            }
            .info-wrapper {
              .item-content {
                border-top-right-radius: 2em;
                border-bottom-right-radius: 2em;
                border-bottom-left-radius: 2em;
                background-color: white;
                float: left;
                color: #333333;
                &::before {
                  position: absolute;
                  top: -1px;
                  left: -10px;
                  width: 0px;
                  height: 0px;
                  content: "";
                  border-top: 0px;
                  border-right: 10px solid #ccc;
                  border-bottom: 5px solid transparent;
                  border-left: 0px;
                }
              }
            }
          }
          .item.sender {
            margin-right: 16px;
            .avatar-wrapper {
              float: right;
              margin-left: 15px;
            }
            .info-wrapper {
              float: right;
              .item-content {
                float: right;
                border-top-left-radius: 2em;
                border-bottom-left-radius: 2em;
                border-bottom-right-radius: 2em;
                background-color: #eed7a5;

                color: #666666;
                &::before {
                  position: absolute;
                  top: -1px;
                  right: -10px;
                  width: 0px;
                  height: 0px;
                  content: "";
                  border-top: 0px;
                  border-right: 0px;
                  border-bottom: 5px solid transparent;
                  border-left: 10px solid #0095ff;
                }
              }
            }
          }
        }
      }
    }
    .common_chat-footer {
      height: 48px;
      margin: 0 16px 0px 16px;
      position: relative;
      border-top-left-radius: 2em;
      border-bottom-left-radius: 2em;
      border-bottom-right-radius: 2em;
      border-top-right-radius: 2em;
      background-color: white;
      .input-wrapper {
        height: 100%;
        position: relative;
        padding: 0px 48px 0px 19px;
        .inputContent {
          width: 100%;
          padding: 2px;
          height: 48px;
          resize: none;
          overflow: auto;
          text-align: left;
          line-height: 1.5;
          font-size: 16px;
          color: #333333;
          outline: 0px solid transparent;
        }
      }
      .send-btn {
        position: absolute;
        top: 0;
        right: 5px;
        height: 48px;
        width: 48px;
        background-position: center;
        background-size: 75% 75%;
        background-repeat: no-repeat;
        &.off,
        &.end {
          background-color: #ccc;
          //   border-color: #ccc;
        }
      }
    }
  }
}
.imgView-dialog {
  background: #00000080;
  height: 100%;
  .el-dialog {
    max-width: 75%;
    position: relative;
    background: transparent;
    box-shadow: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0px;
      text-align: center;
      position: relative;
      .header {
        text-align: right;
        position: relative;
        height: 0px;
        .fa-remove {
          font-size: 32px;
          color: white;
          position: relative;
          right: -50px;
          top: -30px;
          cursor: pointer;
        }
      }
      .main {
        .img {
          max-width: 100%;
          max-height: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>

