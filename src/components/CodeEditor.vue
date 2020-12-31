<template>
  <div class="code-textarea">
    <textarea ref="textarea" :disabled="true"></textarea>
  </div>
</template>

<script>
import { CodeMirror } from "vue-codemirror";

export default {
  name: "codemirror-edit",
  props: {
    option: {
      type: Object,
      default: () => {
        null;
      },
    },
    value: {
      type: String,
      default: () => {},
    },
  },
  data() {
    return {
      cmOption: {
        tabSize: 4,
        styleActiveLine: false,
        lineNumbers: true,
        styleSelectedText: true,
        line: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        mode: "text/x-mysql",
        // hint.js options
        hintOptions: {
          // 当匹配只有一项的时候是否自动补全
          completeSingle: false,
        },
        //快捷键 可提供三种模式 sublime、emacs、vim
        matchBrackets: true,
        showCursorWhenSelecting: true,
        keyMap: "emacs",
        theme: "solarized light",
        extraKeys: { "Alt-/": "autocomplete" },
        autocorrect: true,
        spellcheck: true,
      },
      code: "",
      editor: null,
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.editor = CodeMirror.fromTextArea(this.$refs.textarea, this.cmOption);

      this.editor.setOption("extraKeys", {
        "Ctrl-V": (cm) => {
          navigator.clipboard
            .readText()
            .then((v) => {
              const value = cm.doc.getValue() + v;
              this.initCodeVaule(value);
            })
            .catch((v) => {
              console.log("获取剪贴板失败: ", v);
            });
        },
        "Ctrl-A": (cm) => {
          cm.execCommand("selectAll");
        },
        Tab: (cm) => {
          const spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        },
      });

      this.editor.on("change", (coder) => {
        this.code = coder.getValue();
      });

      this.editor.on("blur", () => {
        this.$emit("update:value", this.code);
      });

      if (this.value) {
        this.initCodeVaule(this.value);
      }

      if (this.option.mode) {
        this.setCodemirrorOption(this.option);
      }
    },

    initCodeVaule(value) {
      this.editor && this.editor.setValue(value);

      const timer = setTimeout(() => {
        this.editor.refresh();
        clearTimeout(timer);
      }, 1);
    },

    setCodemirrorOption(options) {
      Object.keys(options).forEach((key) => {
        if (key === "readOnly" && options[key]) {
          this.editor.setOption("readOnly", "nocursor");
        } else {
          this.editor.setOption(`${key}`, options[key]);
        }
      });
    },

    setCodeMirrorSize(height) {
      this.editor && this.editor.setSize("100%", height);
    },
  },

  watch: {
    option(value) {
      this.setCodemirrorOption(value);
    },
    value(newVal) {
      this.initCodeVaule(newVal);
    },
  },
};
</script>
