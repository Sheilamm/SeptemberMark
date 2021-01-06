<template>
  <div class="markdown-editor">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div>
        <img
          src="@/assets/images/bold.png"
          title="粗体"
          @click="addSyntaxTemplate('bold')"
        />
        <img
          src="@/assets/images/italics.png"
          title="斜体"
          @click="addSyntaxTemplate('italics')"
        />

        <img
          src="@/assets/images/strikethrough.png"
          title="删除线"
          @click="addSyntaxTemplate('strikethrough')"
        />

        <img
          src="@/assets/images/underline.png"
          title="下划线"
          @click="addSyntaxTemplate('underline')"
        />

        <img
          src="@/assets/images/mark.png"
          title="标记"
          @click="addSyntaxTemplate('marker')"
        />

        <img
          src="@/assets/images/title.png"
          title="标题"
          @click="addSyntaxTemplate('H1')"
        />

        <img
          src="@/assets/images/link.png"
          title="链接"
          @click="addSyntaxTemplate('link')"
        />

        <img
          src="@/assets/images/quotation.png"
          title="引用"
          @click="addSyntaxTemplate('quote')"
        />

        <img
          src="@/assets/images/ordered.png"
          title="无序列表"
          @click="addSyntaxTemplate('unorderList')"
        />

        <img
          src="@/assets/images/unordered.png"
          title="有序列表"
          @click="addSyntaxTemplate('orderList')"
        />

        <img
          src="@/assets/images/form.png"
          title="表格"
          @click="addSyntaxTemplate('form')"
        />

        <img
          src="@/assets/images/line.png"
          title="横线"
          @click="addSyntaxTemplate('line')"
        />

        <img
          src="@/assets/images/picture.png"
          title="插入图片"
          @click="addSyntaxTemplate('image')"
        />

        <img
          src="@/assets/images/clear.png"
          title="清除全部"
          @click="addSyntaxTemplate('clear')"
        />
      </div>
      <div>
        <el-dropdown
          trigger="click"
          :hide-on-click="false"
          @command="exportFile"
        >
          <span class="el-dropdown-link"> 导出为 </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="pdf">
              <img src="@/assets/images/pdf.png" height="26px" />
              PDF</el-dropdown-item
            >
            <el-dropdown-item command="word">
              <img src="@/assets/images/word.png" />
              word</el-dropdown-item
            >
            <el-dropdown-item command="markdown">
              <img src="@/assets/images/md.png" />
              markdown</el-dropdown-item
            >
            <el-dropdown-item command="html">
              <img src="@/assets/images/html.png" />
              HTML</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="editor-area">
      <el-row>
        <el-col :span="12">
          <codemirror
            ref="mytextarea"
            :options="cmOptions"
            :value="content"
          ></codemirror>
        </el-col>
        <el-col :span="12">
          <div :class="`md-body md-${new Date().getTime()}`" ref="markItDown">
            <markdown-it-vue :content="content" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown.js";

import "codemirror/theme/3024-night.css";
import "codemirror/theme/base16-light.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/solarized.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";
// require active-line.js
import "codemirror/addon/selection/active-line.js";
// closebrackets
import "codemirror/addon/edit/closebrackets.js";
// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/emacs.js";
import "codemirror/keymap/sublime.js";

// foldGutter
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import MarkdownItVue from "markdown-it-vue";
import "markdown-it-vue/dist/markdown-it-vue.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { codemirror } from "vue-codemirror";

import htmlDocx from "html-docx-js/dist/html-docx";
import { saveAs } from "file-saver";

export default {
  name: "show-down",
  components: {
    MarkdownItVue,
    codemirror,
  },
  props: ["value"],
  data() {
    return {
      content: "",
      editor: null,
      isEditDrawIo: false,
      cmOptions: {
        tabSize: 4,
        indentUnit: 2,
        theme: "3024-night",
        mode: "text/x-markdown",
        highlightFormatting: true,
        maxBlockquoteDepth: true,
        xml: true,
        fencedCodeBlockHighlighting: true,
        allowAtxHeaderWithoutSpace: true,
        lineNumbers: true,
        line: true,
        foldgutter: true,
        gutters: [
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
          "CodeMirror-lint-markers",
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
    this.editor.on("change", (cm) => {
      this.content = cm.getValue();
    });
    this.editor.setOption("extraKeys", {
      "Alt-Q": (cm) => {
        cm.execCommand("goLineLeftCmd");
      },
    });

    if (this.value) {
      this.content = this.value;
    }
  },
  methods: {
    doChange() {
      console.log(this.content);
    },
    async exportFile(value) {
      try {
        const result = await this.$prompt("请输入文件名", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        });
        if (result.value) {
          if (value === "pdf") {
            this.makeMpdf(`${result.value}.pdf`);
          } else if (value === "word") {
            this.downloadWord(`${result.value}.docx`);
          } else if (value === "markdown") {
            this.downloadMD(`${result.value}.md`, this.content);
          } else {
            this.downloadHtml(`${result.value}.html`);
          }
        } else {
          this.$message({
            showClose: true,
            message: "文件名不能为空",
            type: "warning",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    downloadPdf(fileName) {
      const el = document.querySelector(".markdown-body");

      html2canvas(el, {
        useCORS: false,
        allowTaint: false,
        logging: true,
      }).then((canvas) => {
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

        const pageData = canvas.toDataURL("image/jpeg", 1.0);

        const pdf = new jsPDF("", "pt", "a4");

        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          pdf.addImage({
            imageData: pageData,
            angle: -20,
            x: 10,
            y: 40,
            w: imgWidth,
            h: imgHeight,
          });
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
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
    },

    makeMpdf(fileName) {
      const container = this.$refs.markItDown;
      const className = container.className.split(" ")[1];

      const element = document.querySelector(`.${className} .markdown-body`);

      html2canvas(element, {
        // useCORS: true,
        logging: true,
        // allowTaint: true
      }).then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const ctx = canvas.getContext("2d"),
          a4w = 190,
          a4h = 277, //A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
          imgHeight = Math.floor((a4h * canvas.width) / a4w); //按A4显示比例换算一页图像的像素高度
        let renderedHeight = 0;

        while (renderedHeight < canvas.height) {
          const page = document.createElement("canvas");
          page.width = canvas.width;
          page.height = Math.min(imgHeight, canvas.height - renderedHeight); //可能内容不足一页

          page
            .getContext("2d")
            .putImageData(
              ctx.getImageData(
                0,
                renderedHeight,
                canvas.width,
                Math.min(imgHeight, canvas.height - renderedHeight)
              ),
              0,
              0
            );
          pdf.addImage(
            page.toDataURL("image/jpeg", 1.0),
            "JPEG",
            10,
            10,
            a4w,
            Math.min(a4h, (a4w * page.height) / page.width)
          ); //添加图像到页面，保留10mm边距

          renderedHeight += imgHeight;
          if (renderedHeight < canvas.height) pdf.addPage(); //如果后面还有内容，添加一个空页
        }
        pdf.save(fileName);
      });
    },
    convertImagesToBase64() {
      const regularImages = document.querySelectorAll("img");
      const canvas = document.createElement("canvas");

      const ctx = canvas.getContext("2d");

      [].forEach.call(regularImages, function(img) {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height); //使用画布画图

        var dataURL = canvas.toDataURL("image/png", 1.0);
        img.src = dataURL;
      });
      canvas.remove();
    },

    async downloadWord(fileName) {
      const container = this.$refs.markItDown;
      const className = container.className.split(" ")[1];
      const svgElements = document.querySelectorAll(`.${className} svg`);

      if (svgElements.length) {
        for (let index = 0; index < svgElements.length; index++) {
          const svg = svgElements[index];
          const s = new XMLSerializer().serializeToString(svg);
          const src = `data:image/svg+xml;base64,${window.btoa(s)}`;

          const img = new Image();
          img.src = src;

          const url = await new Promise((resolve) => {
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const context = canvas.getContext("2d");
              context.drawImage(img, 0, 0);

              const url = canvas.toDataURL("image/png");

              resolve(url);
            };
          });

          img.src = url;
          svg.parentNode.replaceChild(img, svg);
        }
      }

      // 将html转成blob
      const html = document.querySelector(`.${className}`);

      const htmlString = html.innerHTML;

      const content = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title></title>
          </head>
          <body>
          ${htmlString}
          </body>
        </html>
        `;

      const converted = htmlDocx.asBlob(content);

      // 下载
      saveAs(converted, fileName);
    },

    downloadMD(fileName, content) {
      const urlObject = window.URL || window.webkitURL || window;

      const blob = new Blob([content]);
      let save_link = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      save_link.href = urlObject.createObjectURL(blob);
      save_link.download = fileName;

      const ev = document.createEvent("MouseEvents");
      ev.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      save_link.dispatchEvent(ev);
    },

    downloadHtml(fileName) {
      const container = this.$refs.markItDown;
      const className = container.className.split(" ")[1];

      const bodyHtml = document.querySelector(`.${className}`);
      const cloneEl = bodyHtml.cloneNode(true);
      const div = document.createElement("div");
      div.appendChild(cloneEl);

      const htmlString = div.innerHTML;

      const preHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body`;
      const tailHtml = `</body>
</html>`;

      const content = preHtml + htmlString + tailHtml;

      this.downloadMD(fileName, content);
    },

    addSyntaxTemplate(type) {
      const isSelected = this.editor.somethingSelected();
      const value = this.editor.getValue();
      let newValue = "";

      if (type === "bold") {
        !isSelected && (newValue = value + " **粗体**");
        isSelected && this.setState("**");
      } else if (type === "italics") {
        !isSelected && (newValue = value + " *斜体*");
        isSelected && this.setState("*");
      } else if (type === "strikethrough") {
        !isSelected && (newValue = value + " ~~删除线~~");
        isSelected && this.setState("~~");
      } else if (type === "underline") {
        !isSelected && (newValue = value + " ++下划线++");
        isSelected && this.setState("++");
      } else if (type === "marker") {
        !isSelected && (newValue = value + " ==背景高亮==");
        isSelected && this.setState("==");
      } else if (type === "H1") {
        !isSelected && (newValue = value + " # 一级标题");
        isSelected && this.addUnorderList("# ");
      } else if (type === "link") {
        newValue = value + "  [sobey](http://www.sobey.com)";
      } else if (type === "quote") {
        !isSelected && (newValue = value + "  > ");
        isSelected && this.addUnorderList("> ");
      } else if (type === "code") {
        // newValue = value + '```int a ```';
      } else if (type === "unorderList") {
        !isSelected && (newValue = value + " - 无序列表");
        isSelected && this.addUnorderList("- ");
      } else if (type === "orderList") {
        !isSelected && (newValue = value + " 1. 有序列表1");
        isSelected && this.addOrderList();
      } else if (type === "form") {
        newValue =
          value +
          `header 1 | header 2
---|---
row 1 col 1 | row 1 col 2
row 2 col 1 | row 2 col 2`;
      } else if (type === "line") {
        newValue = value + ` -----------`;
      } else if (type === "image") {
        newValue =
          value +
          ` ![GitHub set up](http://zh.mweb.im/asset/img/set-up-git.gif )`;
      } else if (type === "pagebreak") {
        newValue = value + `[========]`;
      }

      (newValue || type === "clear") && this.editor.setValue(newValue);
    },

    addOrderList() {
      const selectContent = this.editor.listSelections()[0]; // 第一个选中的文本
      let { anchor, head } = selectContent;
      head.line >= anchor.line &&
        head.sticky === "before" &&
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
        let preBlank = "";
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
        head.sticky === "before" &&
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
          this.editor.replaceRange("", { line: preLine, ch: 0 }, head);
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
        head.sticky === "before" &&
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
        this.editor.replaceRange("", anchor, {
          line: aftLine,
          ch: aftPos + changePos,
        });
      preAlready &&
        this.editor.replaceRange(
          "",
          { line: preLine, ch: prePos - changePos },
          head
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
          { line: preLine, ch: prePos }
        );
      } else if (!preAlready) {
        // 只有后面有matchStr
        this.editor.setCursor(head);
        this.editor.replaceSelection(matchStr);
        prePos += changePos;
        aftPos += aftLine === preLine ? changePos : 0;
        this.editor.setSelection(
          { line: aftLine, ch: aftPos },
          { line: preLine, ch: prePos }
        );
      } else if (!aftAlready) {
        // 只有前面有matchStr
        this.editor.setCursor({ line: aftLine, ch: aftPos - changePos });
        this.editor.replaceSelection(matchStr);
        prePos -= changePos;
        aftPos -= aftLine === preLine ? changePos : 0;
        this.editor.setSelection(
          { line: aftLine, ch: aftPos },
          { line: preLine, ch: prePos }
        );
      }
      this.editor.focus();
    },
  },
  watch: {
    value(val) {
      this.content = val;
    },
    content(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style scoped>
.markdown-editor {
  height: 100%;
  width: 100%;
}
.toolbar {
  height: 40px;
  background: #f2f2f2;
  text-align: start;
  padding: 0px 20px;
  line-height: 50px;
  text-align: start;
  display: flex;
  justify-content: space-between;
}

img {
  margin: 0px 10px;
  cursor: pointer;
  height: 20px;
}
.markdown-editor .editor-area {
  background: #f2f2f2;
  height: calc(100% - 40px);
}

.md-body {
  height: calc(100% - 30px);
  background: #fff;
  margin-left: 20px;
  text-align: start;
  padding: 15px;
  overflow-y: auto;
}

.markdown-body {
  padding: 10px;
}
</style>

<style>
.markdown-editor .vue-codemirror {
  height: 100%;
}
.markdown-editor .CodeMirror {
  height: 100%;
  text-align: start;
}
.markdown-editor .el-row {
  display: flex;
  height: 100%;
}

.markdown-editor .el-col {
  height: 700px;
}

.markdown-editor .el-dropdown-link {
  font-family: "Times New Roman", Times, serif;
  cursor: pointer;
}
</style>
