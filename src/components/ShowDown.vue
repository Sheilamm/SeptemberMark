<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div class="toolbar">
      <i class="iconfont" title="粗体">&#xe61c;</i>
      <i class="iconfont" title="斜体">&#xe614;</i>
      <i class="iconfont" title="删除线">&#xe61b;</i>
      <i class="iconfont" title="下划线">&#xe634;</i>
      <i class="iconfont" title="标记">&#xe66a;</i>
      <i class="iconfont" title="标题">&#xe645;</i>
      <i class="iconfont" title="链接">&#xe625;</i>
      <i class="iconfont" title="引用">&#xe697;</i>
      <i class="iconfont" title="代码">&#xe610;</i>
      <i class="iconfont" title="无序列表">&#xe82d;</i>
      <i class="iconfont" title="有序列表">&#xe694;</i>
      <i class="iconfont" title="表格">&#xe82f;</i>
      <i class="iconfont" title="横线">&#xe600;</i>
      <i class="iconfont" title="插入图片">&#xe82c;</i>
      <i class="iconfont" title="插入分页符">&#xe646;</i>
      <i class="iconfont" title="清除全部">&#xe82e;</i>
      <i class="iconfont" title="导出">&#xe6ad;</i>
    </div>
    <div class="editor-area">
      <el-row>
        <el-col :span="12">
          <codemirror ref="mytextarea" :options="cmOptions"></codemirror>
        </el-col>
        <el-col :span="12" class="md-body">
          <markdown-it-vue :content="content" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue';
import 'markdown-it-vue/dist/markdown-it-vue.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { codemirror } from 'vue-codemirror';

import 'codemirror/mode/markdown/markdown.js';

import 'codemirror/theme/3024-night.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/match-highlighter.js';
// require active-line.js
import 'codemirror/addon/selection/active-line.js';
// closebrackets
import 'codemirror/addon/edit/closebrackets.js';
// keyMap
import 'codemirror/mode/clike/clike.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/keymap/emacs.js';
import 'codemirror/keymap/sublime.js';

// foldGutter
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';

export default {
  components: {
    MarkdownItVue,
    codemirror,
  },
  data() {
    return {
      content: '',
      editor: null,
      cmOptions: {
        tabSize: 4,
        indentUnit: 2,

        theme: '3024-night',
        mode: 'text/x-markdown',
        highlightFormatting: true,
        maxBlockquoteDepth: true,
        xml: true,
        fencedCodeBlockHighlighting: true,
        allowAtxHeaderWithoutSpace: true,

        lineNumbers: true,

        line: true,

        foldgutter: true,

        gutters: [
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
          'CodeMirror-lint-markers',
        ],

        lineWrapping: true, //代码折叠
        foldGutter: true,

        matchBrackets: true, //括号匹配
        autoCloseBrackets: true,
      },
    };
  },
  mounted() {
    this.editor = this.$refs.mytextarea.codemirror;
    this.editor.on('change', (cm) => {
      this.content = cm.getValue();
    });
  },
  methods: {
    exportFile() {
      this.downloadPdf('a.pdf');
    },

    downloadFile(fileName, content) {
      const aLink = document.createElement('a');
      const blob = new Blob([content]);
      // const evt = document.createEvent('HTMLEvents');
      aLink.download = fileName;
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
    },

    downloadPdf(fileName) {
      const el = document.querySelector('.markdown-body');
      try {
        html2canvas(el).then((canvas) => {
          var contentWidth = canvas.width;
          var contentHeight = canvas.height;

          //一页pdf显示html页面生成的canvas高度;
          var pageHeight = (contentWidth / 592.28) * 841.89;
          //未生成pdf的html页面高度
          var leftHeight = contentHeight;
          //页面偏移
          var position = 0;
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          var imgWidth = 595.28;
          var imgHeight = (592.28 / contentWidth) * contentHeight;

          var pageData = canvas.toDataURL('image/jpeg', 1.0);
          console.log(pageData);

          var pdf = new jsPDF('', 'pt', 'a4');

          //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
          //当内容未超过pdf一页显示的范围，无需分页
          if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
          } else {
            while (leftHeight > 0) {
              pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
              leftHeight -= pageHeight;
              position -= 841.89;
              //避免添加空白页
              if (leftHeight > 0) {
                pdf.addPage();
              }
            }
          }

          pdf.save(fileName);
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
/* .markdown-editor {
  height: 1080px;
} */
.toolbar {
  height: 40px;
  background: #f2f2f2;
  text-align: start;
  padding: 0px 20px;
  line-height: 40px;
}
i {
  margin: 0px 10px;
  cursor: pointer;
}
.editor-area {
  background: #f2f2f2;
  height: calc(100% - 40px);
}
.el-row {
  display: flex;
}
.md-body {
  /* height: 900px; */
  background: #fff;
  margin-left: 20px;
}
.el-col {
  height: 890px;
}

.vue-codemirror {
  height: 100%;
}
.CodeMirror {
  height: 890px !important;
}
</style>
