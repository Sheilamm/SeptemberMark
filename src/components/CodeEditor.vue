<template>
  <div class="code-textarea">
    <textarea ref="textarea" :disabled="true"></textarea>
    <!-- <codemirror v-model="scriptCode" :options="cmOption" /> -->
  </div>
</template>

<script>
import { CodeMirror } from 'vue-codemirror';
// language
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/sql/sql.js';
// theme css
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/solarized.css';

// hint
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/selection/active-line.js';
// highlightSelectionMatches
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
import 'codemirror/addon/fold/xml-fold.js';

export default {
  name: 'codemirror-edit',
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
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        mode: 'text/x-mysql',
        // hint.js options
        hintOptions: {
          // 当匹配只有一项的时候是否自动补全
          completeSingle: false,
        },
        //快捷键 可提供三种模式 sublime、emacs、vim
        matchBrackets: true,
        showCursorWhenSelecting: true,
        keyMap: 'emacs',
        theme: 'solarized light',
        extraKeys: { 'Alt-/': 'autocomplete' },
        autocorrect: true,
        spellcheck: true,
      },
      code: '',
      editor: null,
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.editor = CodeMirror.fromTextArea(this.$refs.textarea, this.cmOption);

      this.editor.setOption('extraKeys', {
        'Ctrl-V': (cm) => {
          navigator.clipboard
            .readText()
            .then((v) => {
              const value = cm.doc.getValue() + v;
              this.initCodeVaule(value);
            })
            .catch((v) => {
              console.log('获取剪贴板失败: ', v);
            });
        },
        'Ctrl-A': (cm) => {
          cm.execCommand('selectAll');
        },
        Tab: (cm) => {
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
          cm.replaceSelection(spaces);
        },
      });

      this.editor.on('change', (coder) => {
        this.code = coder.getValue();
      });

      this.editor.on('blur', () => {
        this.$emit('update:value', this.code);
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
        if (key === 'readOnly' && options[key]) {
          this.editor.setOption('readOnly', 'nocursor');
        } else {
          this.editor.setOption(`${key}`, options[key]);
        }
      });
    },

    setCodeMirrorSize(height) {
      this.editor && this.editor.setSize('100%', height);
    },

    // hintOptions() {
    //   (function(mod) {
    //     mod(CodeMirror);
    //   })(function(CodeMirror) {
    //     'use strict';

    //     var tables;
    //     var defaultTable;
    //     var keywords;
    //     var identifierQuote;
    //     var CONS = {
    //       QUERY_DIV: ';',
    //       ALIAS_KEYWORD: 'AS',
    //     };
    //     cjdc;
    //     var Pos = CodeMirror.Pos,
    //       cmpPos = CodeMirror.cmpPos;

    //     function isArray(val) {
    //       return Object.prototype.toString.call(val) == '[object Array]';
    //     }

    //     function getKeywords(editor) {
    //       var mode = editor.doc.modeOption;
    //       if (mode === 'sql') mode = 'text/x-sql';
    //       return CodeMirror.resolveMode(mode).keywords;
    //     }

    //     function getIdentifierQuote(editor) {
    //       var mode = editor.doc.modeOption;
    //       if (mode === 'sql') mode = 'text/x-sql';
    //       return CodeMirror.resolveMode(mode).identifierQuote || '`';
    //     }

    //     function getText(item) {
    //       return typeof item == 'string' ? item : item.text;
    //     }

    //     function wrapTable(name, value) {
    //       if (isArray(value)) value = { columns: value };
    //       if (!value.text) value.text = name;
    //       return value;
    //     }

    //     function parseTables(input) {
    //       var result = {};
    //       if (isArray(input)) {
    //         for (var i = input.length - 1; i >= 0; i--) {
    //           var item = input[i];
    //           result[getText(item).toUpperCase()] = wrapTable(getText(item), item);
    //         }
    //       } else if (input) {
    //         for (var name in input) result[name.toUpperCase()] = wrapTable(name, input[name]);
    //       }
    //       return result;
    //     }

    //     function getTable(name) {
    //       return tables[name.toUpperCase()];
    //     }

    //     function shallowClone(object) {
    //       var result = {};
    //       for (var key in object) if (object.hasOwnProperty(key)) result[key] = object[key];
    //       return result;
    //     }

    //     function match(string, word) {
    //       var len = string.length;
    //       var sub = getText(word).substr(0, len);
    //       return string.toUpperCase() === sub.toUpperCase();
    //     }

    //     function addMatches(result, search, wordlist, formatter) {
    //       if (isArray(wordlist)) {
    //         for (var i = 0; i < wordlist.length; i++)
    //           if (match(search, wordlist[i])) result.push(formatter(wordlist[i]));
    //       } else {
    //         for (var word in wordlist)
    //           if (wordlist.hasOwnProperty(word)) {
    //             var val = wordlist[word];
    //             if (!val || val === true) val = word;
    //             else
    //               val = val.displayText
    //                 ? { text: val.text, displayText: val.displayText }
    //                 : val.text;
    //             if (match(search, val)) result.push(formatter(val));
    //           }
    //       }
    //     }

    //     function cleanName(name) {
    //       // Get rid name from identifierQuote and preceding dot(.)
    //       if (name.charAt(0) == '.') {
    //         name = name.substr(1);
    //       }
    //       // replace doublicated identifierQuotes with single identifierQuotes
    //       // and remove single identifierQuotes
    //       var nameParts = name.split(identifierQuote + identifierQuote);
    //       for (var i = 0; i < nameParts.length; i++)
    //         nameParts[i] = nameParts[i].replace(new RegExp(identifierQuote, 'g'), '');
    //       return nameParts.join(identifierQuote);
    //     }

    //     function insertIdentifierQuotes(name) {
    //       var nameParts = getText(name).split('.');
    //       for (var i = 0; i < nameParts.length; i++)
    //         nameParts[i] =
    //           identifierQuote +
    //           // doublicate identifierQuotes
    //           nameParts[i].replace(
    //             new RegExp(identifierQuote, 'g'),
    //             identifierQuote + identifierQuote,
    //           ) +
    //           identifierQuote;
    //       var escaped = nameParts.join('.');
    //       if (typeof name == 'string') return escaped;
    //       name = shallowClone(name);
    //       name.text = escaped;
    //       return name;
    //     }

    //     function nameCompletion(cur, token, result, editor) {
    //       // Try to complete table, column names and return start position of completion
    //       var useIdentifierQuotes = false;
    //       var nameParts = [];
    //       var start = token.start;
    //       var cont = true;
    //       while (cont) {
    //         cont = token.string.charAt(0) == '.';
    //         useIdentifierQuotes = useIdentifierQuotes || token.string.charAt(0) == identifierQuote;

    //         start = token.start;
    //         nameParts.unshift(cleanName(token.string));

    //         token = editor.getTokenAt(Pos(cur.line, token.start));
    //         if (token.string == '.') {
    //           cont = true;
    //           token = editor.getTokenAt(Pos(cur.line, token.start));
    //         }
    //       }

    //       // Try to complete table names
    //       var string = nameParts.join('.');
    //       addMatches(result, string, tables, function(w) {
    //         return useIdentifierQuotes ? insertIdentifierQuotes(w) : w;
    //       });

    //       // Try to complete columns from defaultTable
    //       addMatches(result, string, defaultTable, function(w) {
    //         return useIdentifierQuotes ? insertIdentifierQuotes(w) : w;
    //       });

    //       // Try to complete columns
    //       string = nameParts.pop();
    //       var table = nameParts.join('.');

    //       var alias = false;
    //       var aliasTable = table;
    //       // Check if table is available. If not, find table by Alias
    //       if (!getTable(table)) {
    //         var oldTable = table;
    //         table = findTableByAlias(table, editor);
    //         if (table !== oldTable) alias = true;
    //       }

    //       var columns = getTable(table);
    //       if (columns && columns.columns) columns = columns.columns;

    //       if (columns) {
    //         addMatches(result, string, columns, function(w) {
    //           var tableInsert = table;
    //           if (alias == true) tableInsert = aliasTable;
    //           if (typeof w == 'string') {
    //             w = tableInsert + '.' + w;
    //           } else {
    //             w = shallowClone(w);
    //             w.text = tableInsert + '.' + w.text;
    //           }
    //           return useIdentifierQuotes ? insertIdentifierQuotes(w) : w;
    //         });
    //       }

    //       return start;
    //     }

    //     function eachWord(lineText, f) {
    //       var words = lineText.split(/\s+/);
    //       for (var i = 0; i < words.length; i++) if (words[i]) f(words[i].replace(/[,;]/g, ''));
    //     }

    //     function findTableByAlias(alias, editor) {
    //       var doc = editor.doc;
    //       var fullQuery = doc.getValue();
    //       var aliasUpperCase = alias.toUpperCase();
    //       var previousWord = '';
    //       var table = '';
    //       var separator = [];
    //       var validRange = {
    //         start: Pos(0, 0),
    //         end: Pos(editor.lastLine(), editor.getLineHandle(editor.lastLine()).length),
    //       };

    //       //add separator
    //       var indexOfSeparator = fullQuery.indexOf(CONS.QUERY_DIV);
    //       while (indexOfSeparator != -1) {
    //         separator.push(doc.posFromIndex(indexOfSeparator));
    //         indexOfSeparator = fullQuery.indexOf(CONS.QUERY_DIV, indexOfSeparator + 1);
    //       }
    //       separator.unshift(Pos(0, 0));
    //       separator.push(
    //         Pos(editor.lastLine(), editor.getLineHandle(editor.lastLine()).text.length),
    //       );

    //       //find valid range
    //       var prevItem = null;
    //       var current = editor.getCursor();
    //       for (var i = 0; i < separator.length; i++) {
    //         if (
    //           (prevItem == null || cmpPos(current, prevItem) > 0) &&
    //           cmpPos(current, separator[i]) <= 0
    //         ) {
    //           validRange = { start: prevItem, end: separator[i] };
    //           break;
    //         }
    //         prevItem = separator[i];
    //       }

    //       if (validRange.start) {
    //         var query = doc.getRange(validRange.start, validRange.end, false);

    //         for (var i = 0; i < query.length; i++) {
    //           var lineText = query[i];
    //           eachWord(lineText, function(word) {
    //             var wordUpperCase = word.toUpperCase();
    //             if (wordUpperCase === aliasUpperCase && getTable(previousWord))
    //               table = previousWord;
    //             if (wordUpperCase !== CONS.ALIAS_KEYWORD) previousWord = word;
    //           });
    //           if (table) break;
    //         }
    //       }
    //       return table;
    //     }

    //     CodeMirror.registerHelper('hint', 'sql', function(editor, options) {
    //       tables = parseTables(options && options.tables);
    //       var defaultTableName = options && options.defaultTable;
    //       var disableKeywords = options && options.disableKeywords;
    //       defaultTable = defaultTableName && getTable(defaultTableName);
    //       keywords = getKeywords(editor);
    //       identifierQuote = getIdentifierQuote(editor);

    //       if (defaultTableName && !defaultTable)
    //         defaultTable = findTableByAlias(defaultTableName, editor);

    //       defaultTable = defaultTable || [];

    //       if (defaultTable.columns) defaultTable = defaultTable.columns;

    //       var cur = editor.getCursor();
    //       var result = [];
    //       var token = editor.getTokenAt(cur),
    //         start,
    //         end,
    //         search;
    //       if (token.end > cur.ch) {
    //         token.end = cur.ch;
    //         token.string = token.string.slice(0, cur.ch - token.start);
    //       }

    //       if (token.string.match(/^[.`"'\w@][\w$#]*$/g)) {
    //         search = token.string;
    //         start = token.start;
    //         end = token.end;
    //       } else {
    //         start = end = cur.ch;
    //         search = '';
    //       }
    //       if (search.charAt(0) == '.' || search.charAt(0) == identifierQuote) {
    //         start = nameCompletion(cur, token, result, editor);
    //       } else {
    //         var objectOrClass = function(w, className) {
    //           if (typeof w === 'object') {
    //             w.className = className;
    //           } else {
    //             w = { text: w, className: className };
    //           }
    //           return w;
    //         };
    //         addMatches(result, search, defaultTable, function(w) {
    //           return objectOrClass(w, 'CodeMirror-hint-table CodeMirror-hint-default-table');
    //         });
    //         addMatches(result, search, tables, function(w) {
    //           return objectOrClass(w, 'CodeMirror-hint-table');
    //         });
    //         if (!disableKeywords)
    //           addMatches(result, search, keywords, function(w) {
    //             return objectOrClass(w.toUpperCase(), 'CodeMirror-hint-keyword');
    //           });
    //       }

    //       return { list: result, from: Pos(cur.line, start), to: Pos(cur.line, end) };
    //     });
    //   });

    // },
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
