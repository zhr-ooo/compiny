<template>
  <div class="tinymce-editor">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick">
    </editor>

  </div>
</template>

<script>
  import { httpAction } from "@/api/manage";
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver/theme'
  import * as qiniu from 'qiniu-js'
  // import 'tinymce/plugins/image'
  import '@/utils/plugin';
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/textcolor'
  import 'tinymce/plugins/fullscreen'
  export default {
    components: {
      Editor
    },
    props: {
      value: {
        type: String,
        required:false
      },
      triggerChange:{
        type: Boolean,
        default: false,
        required:false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'lists image media table textcolor wordcount contextmenu fullscreen link'
      },
      toolbar: {
        type: [String, Array],
        default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table link | removeformat | fullscreen'
      }
    },
    data() {
      return {
        percent: '',
        isChuan: false,
        //初始化配置
        init: {
          language_url: '/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/tinymce/skins/lightgray',
          height: 300,
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          file_picker_callback: (callback, value, meta) => {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.click();
            let that = this;
            input.onchange = function() {
              var files = this.files[0];
              console.log(files)
              if (meta.filetype == 'media') {
                if (files.type.indexOf('video') == -1 && files.type.indexOf('audio') == -1) {
                  that.$message.warning('请选择视频或音频');
                  return
                }
              }
              if (files.type.indexOf('video') > -1) {
                let url = URL.createObjectURL(files)
                var audioElement = new Audio(url)
                audioElement.addEventListener('loadedmetadata',function(){
                  let playTime = audioElement.duration; //playTime就是当前视频长度
                  if (playTime > 600) {
                    that.$message.warning('视频时长不能超过10分钟!')
                    that.isChuan = false;
                  } else {
                    that.isChuan = true;
                  }
                })
              }
              if (meta.filetype == 'image') {
                if (files.type.indexOf('image') == -1) {
                  that.$message.warning('请选择图片');
                  return
                }
              }
              // let formData = new FormData();
              const suffix = "." + files.name.replace(/^.+\./, '')
              // let file = new FormData();
              // file.append('file', files, files.name);
              if (that.isChuan) {
                let hide = that.$message.loading('上传中...' + that.percent, 0);
                httpAction('/qiniuUpToken', {}, 'post').then((res) => {
                  if (res) {
                    let token = res.data.token
                    // let file = new FormData();
                    // file.append('file', files, files.name);
                    const key = new Date().getTime() + suffix;
                    let domain = window._CONFIG['domianQiNiu']
                    let config = {
                      useCdnDomain: true,
                      region: null
                    }
                    let putExtra = {
                      fname: '',
                      params: {},
                      mimeType: null
                    }
                    let observable = qiniu.upload(files, key, token, putExtra, config);
                    observable.subscribe({
                      next: (res) => {
                        that.percent = res.total.percent.toFixed(2)
                      },
                      error: () => {
                        that.$message.error('上传失败')
                        setTimeout(hide, 500)
                      },
                      complete: (response) => {
                        const coverimg = `${domain}/${response.key}`;
                        setTimeout(hide, 500)
                        callback(coverimg);
                      }
                    })
                  }
                })
              }



              // formData.append('multipartFiles', files, files.name);
              // httpAction('/fileupload',formData,'post').then((res)=>{
              //   console.log(res);
              //   if(res.statusCode == '200') {
              //     callback(res.data[0]);
              //   } else {
              //     callback(files.name);
              //   }
              // }).finally(() => {
              //   // that.close();
              //   setTimeout(hide, 500)
              // })
              console.log(files);
            };
          },
        },
        myValue: this.value
      }
    },
    mounted() {
      tinymce.init({})
    },
    methods: {

      onClick(e) {
        this.$emit('onClick', e, tinymce)
      },
      //可以添加一些自己的自定义事件，如清空内容
      clear() {
        this.myValue = ''
      }
    },
    watch: {
      value(newValue) {
        this.myValue = (newValue == null ? '' : newValue)
      },
      myValue(newValue) {
        console.log(newValue)
        if(this.triggerChange){
          console.log(1)
          this.$emit('change', newValue)
        }else{
          console.log(2)
          this.$emit('input', newValue)
        }
      }
    }
  }

</script>
<style>
  .ant-message {
    z-index: 3000 !important;
  }
</style>
