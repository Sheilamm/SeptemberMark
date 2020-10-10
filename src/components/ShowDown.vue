<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div>
        <i class="iconfont" title="粗体" @click="addSyntaxTemplate('bold')"
          >&#xe61c;</i
        >
        <i class="iconfont" title="斜体" @click="addSyntaxTemplate('italics')"
          >&#xe614;</i
        >
        <i
          class="iconfont"
          title="删除线"
          @click="addSyntaxTemplate('strikethrough')"
          >&#xe61b;</i
        >
        <i
          class="iconfont"
          title="下划线"
          @click="addSyntaxTemplate('underline')"
          >&#xe634;</i
        >
        <i class="iconfont" title="标记" @click="addSyntaxTemplate('marker')"
          >&#xe66a;</i
        >

        <i class="iconfont" title="标题" @click="addSyntaxTemplate('H1')"
          >&#xe645;</i
        >
        <i class="iconfont" title="链接" @click="addSyntaxTemplate('link')"
          >&#xe625;</i
        >
        <i class="iconfont" title="引用" @click="addSyntaxTemplate('quote')"
          >&#xe697;</i
        >
        <i class="iconfont" title="代码" @click="addSyntaxTemplate('code')"
          >&#xe610;</i
        >
        <i
          class="iconfont"
          title="无序列表"
          @click="addSyntaxTemplate('unorderList')"
          >&#xe82d;</i
        >
        <i
          class="iconfont"
          title="有序列表"
          @click="addSyntaxTemplate('orderList')"
          >&#xe694;</i
        >
        <i class="iconfont" title="表格" @click="addSyntaxTemplate('form')"
          >&#xe82f;</i
        >
        <i class="iconfont" title="横线" @click="addSyntaxTemplate('line')"
          >&#xe600;</i
        >
        <i class="iconfont" title="插入图片" @click="addSyntaxTemplate('image')"
          >&#xe82c;</i
        >
        <i
          class="iconfont"
          title="插入分页符"
          @click="addSyntaxTemplate('pagebreak')"
          >&#xe646;</i
        >
        <i class="iconfont" title="清除全部" @click="addSyntaxTemplate('clear')"
          >&#xe82e;</i
        >
      </div>
      <div>
        <el-dropdown
          trigger="click"
          :hide-on-click="false"
          @command="exportFile"
        >
          <span class="el-dropdown-link">
            导出为
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="pdf">
              <i class="iconfont" style="color:#f40757">&#xe62d;</i>
              PDF</el-dropdown-item
            >
            <el-dropdown-item command="word"
              ><i class="iconfont" style="color:#0b5bea">&#xe67a;</i
              >word</el-dropdown-item
            >
            <el-dropdown-item command="markdown"
              ><i class="iconfont" style="color:#1aaba8">&#xe625;</i
              >markdown</el-dropdown-item
            >
            <el-dropdown-item command="html"
              ><i class="iconfont" style="color:#ba410e">&#xe620;</i
              >HTML</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
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

import { exportWord } from 'mhtml-to-word';

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

        lineWrapping: true,
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
    this.editor.setOption('extraKeys', {
      'Alt-Q': (cm) => {
        cm.execCommand('goLineLeftCmd');
      },
    });
  },
  methods: {
    exportFile(value) {
      if (value === 'pdf') {
        this.downloadPdf('a.pdf');
      } else if (value === 'word') {
        this.downloadWord('a');
      } else if (value === 'markdown') {
        // this.downloadMK()
      } else {
        // this.downloadHtml()
      }
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
          const contentWidth = canvas.width;
          const contentHeight = canvas.height;

          //一页pdf显示html页面生成的canvas高度;
          const pageHeight = (contentWidth / 592.28) * 841.89;
          //未生成pdf的html页面高度
          let leftHeight = contentHeight;
          //页面偏移
          let position = 0;
          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          const imgWidth = 595.28;
          const imgHeight = (592.28 / contentWidth) * contentHeight;

          const pageData = canvas.toDataURL('image/jpeg', 1.0);

          const pdf = new jsPDF('', 'pt', 'a4');

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

    downloadWord(fileName) {
      exportWord({
        selector: '.md-body',
        filename: fileName,
      });
    },

    addSyntaxTemplate(type) {
      const isSelected = this.editor.somethingSelected();
      const value = this.editor.getValue();
      let newValue = '';

      if (type === 'bold') {
        !isSelected && (newValue = value + ' **粗体**');
        isSelected && this.setState('**');
      } else if (type === 'italics') {
        !isSelected && (newValue = value + ' *斜体*');
        isSelected && this.setState('*');
      } else if (type === 'strikethrough') {
        !isSelected && (newValue = value + ' ~~删除线~~');
        isSelected && this.setState('~~');
      } else if (type === 'underline') {
        !isSelected && (newValue = value + ' ++下划线++');
        isSelected && this.setState('++');
      } else if (type === 'marker') {
        !isSelected && (newValue = value + ' ==背景高亮==');
        isSelected && this.setState('==');
      } else if (type === 'H1') {
        !isSelected && (newValue = value + ' # 一级标题');
        isSelected && this.addUnorderList('# ');
      } else if (type === 'link') {
        newValue = value + '  [sobey](http://www.sobey.com)';
      } else if (type === 'quote') {
        !isSelected && (newValue = value + '  > ');
        isSelected && this.addUnorderList('> ');
      } else if (type === 'code') {
        // newValue = value + '```int a ```';
      } else if (type === 'unorderList') {
        !isSelected && (newValue = value + ' - 无序列表');
        isSelected && this.addUnorderList('- ');
      } else if (type === 'orderList') {
        !isSelected && (newValue = value + ' 1. 有序列表1');
        isSelected && this.addOrderList();
      } else if (type === 'form') {
        newValue =
          value +
          `header 1 | header 2
---|---
row 1 col 1 | row 1 col 2
row 2 col 1 | row 2 col 2`;
      } else if (type === 'line') {
        newValue = value + ` -----------`;
      } else if (type === 'image') {
        newValue =
          value +
          ` ![GitHub set up](http://zh.mweb.im/asset/img/set-up-git.gif )`;
      }

      (newValue || type === 'clear') && this.editor.setValue(newValue);
    },

    addOrderList() {
      const selectContent = this.editor.listSelections()[0]; // 第一个选中的文本
      let { anchor, head } = selectContent;
      head.line >= anchor.line &&
        head.sticky === 'before' &&
        ([head, anchor] = [anchor, head]);
      let preLine = head.line;
      let aftLine = anchor.line;
      if (preLine !== aftLine) {
        // 选中了多行，在每行前加上匹配字符
        let preNumber = 0;
        let pos = 0;
        for (let i = preLine; i <= aftLine; i++) {
          this.editor.setCursor({ line: i, ch: 0 });
          const replaceStr = `${++preNumber}. `;
          this.editor.replaceSelection(replaceStr);
          if (i === aftLine) {
            pos += (replaceStr + this.editor.getLine(i)).length;
          }
        }
        this.editor.setCursor({ line: aftLine, ch: pos });
        this.editor.focus();
      } else {
        const selectVal = this.editor.getSelection();
        let preStr = this.editor.getRange({ line: preLine, ch: 0 }, head);
        let preNumber = 0;
        let preBlank = '';
        if (/^( |\t)+/.test(preStr)) {
          // 有序列表标识前也许会有空格或tab缩进
          preBlank = preStr.match(/^( |\t)+/)[0];
          preStr = preStr.trimLeft();
        }
        if (/^\d+(\.) /.test(preStr)) {
          // 是否以'数字. '开头，找出前面的数字
          preNumber = Number.parseInt(preStr.match(/^\d+/)[0]);
        }
        let replaceStr = `\n${preBlank}${preNumber + 1}. ${selectVal}\n`;
        this.editor.replaceSelection(replaceStr);
        this.editor.setCursor({ line: preLine + 1, ch: replaceStr.length });
      }
    },

    addUnorderList(matchStr) {
      const selectContent = this.editor.listSelections()[0]; // 第一个选中的文本
      let { anchor, head } = selectContent;
      head.line >= anchor.line &&
        head.sticky === 'before' &&
        ([head, anchor] = [anchor, head]);
      let preLine = head.line;
      let aftLine = anchor.line;
      if (preLine !== aftLine) {
        // 选中了多行，在每行前加上匹配字符
        let pos = matchStr.length;
        for (let i = preLine; i <= aftLine; i++) {
          this.editor.setCursor({ line: i, ch: 0 });
          this.editor.replaceSelection(matchStr);
          i === aftLine && (pos += this.editor.getLine(i).length);
        }
        this.editor.setCursor({ line: aftLine, ch: pos });
        this.editor.focus();
      } else {
        // 检测开头是否有匹配的字符串，有就将其删除
        const preStr = this.editor.getRange({ line: preLine, ch: 0 }, head);
        if (preStr === matchStr) {
          this.editor.replaceRange('', { line: preLine, ch: 0 }, head);
        } else {
          const selectVal = this.editor.getSelection();
          let replaceStr = `\n\n${matchStr}${selectVal}\n\n`;
          this.editor.replaceSelection(replaceStr);
          this.editor.setCursor({
            line: preLine + 2,
            ch: (matchStr + selectVal).length,
          });
        }
      }
    },

    setState(matchStr) {
      const changePos = matchStr.length; // matchStr为传入参数，可以是'**','*','~~','`'或者其他符合markdown语法的字符串
      let preAlready = false,
        aftAlready = false;

      // 如果选中了文本
      const selectContent = this.editor.listSelections()[0]; // 第一个选中的文本
      let { anchor, head } = selectContent; // 前后光标位置
      head.line >= anchor.line &&
        head.sticky === 'before' &&
        ([head, anchor] = [anchor, head]);
      let { line: preLine, ch: prePos } = head;
      let { line: aftLine, ch: aftPos } = anchor;
      // 判断前后是否有matchStr
      this.editor.getRange({ line: preLine, ch: prePos - changePos }, head) ===
        matchStr && (preAlready = true);
      this.editor.getRange(anchor, {
        line: aftLine,
        ch: aftPos + changePos,
      }) === matchStr && (aftAlready = true);
      // 去除前后的matchStr
      aftAlready &&
        this.editor.replaceRange('', anchor, {
          line: aftLine,
          ch: aftPos + changePos,
        });
      preAlready &&
        this.editor.replaceRange(
          '',
          { line: preLine, ch: prePos - changePos },
          head,
        );
      if (!preAlready && !aftAlready) {
        // 前后都没有matchStr
        this.editor.setCursor(anchor);
        this.editor.replaceSelection(matchStr);
        this.editor.setCursor(head);
        this.editor.replaceSelection(matchStr);
        prePos += changePos;
        aftPos += aftLine === preLine ? changePos : 0;
        this.editor.setSelection(
          { line: aftLine, ch: aftPos },
          { line: preLine, ch: prePos },
        );
      } else if (!preAlready) {
        // 只有后面有matchStr
        this.editor.setCursor(head);
        this.editor.replaceSelection(matchStr);
        prePos += changePos;
        aftPos += aftLine === preLine ? changePos : 0;
        this.editor.setSelection(
          { line: aftLine, ch: aftPos },
          { line: preLine, ch: prePos },
        );
      } else if (!aftAlready) {
        // 只有前面有matchStr
        this.editor.setCursor({ line: aftLine, ch: aftPos - changePos });
        this.editor.replaceSelection(matchStr);
        prePos -= changePos;
        aftPos -= aftLine === preLine ? changePos : 0;
        this.editor.setSelection(
          { line: aftLine, ch: aftPos },
          { line: preLine, ch: prePos },
        );
      }
      this.editor.focus();
    },
  },
};
</script>

<style>
.toolbar {
  height: 40px;
  background: #f2f2f2;
  text-align: start;
  padding: 0px 20px;
  line-height: 40px;
  text-align: start;
  display: flex;
  justify-content: space-between;
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
  text-align: start;
  padding: 15px;
  overflow-y: auto;
}
.el-col {
  height: 890px;
}

.vue-codemirror {
  height: 100%;
}
.CodeMirror {
  height: 890px !important;
  text-align: start;
}
.el-dropdown-link {
  font-family: 'Times New Roman', Times, serif;
  cursor: pointer;
}
</style>
