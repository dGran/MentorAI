/* ============================================================
   MentorAI — Resaltador de sintaxis propio (offline)
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Resaltador de sintaxis propio ----------
     Una sola pasada con un regex combinado por lenguaje. Gana el token
     que empieza antes; a igualdad de posición, el primero de la lista.
     Así no hay colisiones entre reglas (p. ej. números dentro de strings). */
  MentorAI.SyntaxHighlighter = (function () {
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    // Cada regla usa SOLO grupos no capturadores (?:...) para que el grupo
    // capturador externo de cada alternativa identifique la regla.
    const LANGUAGES = {
      php: [
        { cls: "comment", src: "\\/\\/[^\\n]*|#[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" },
        { cls: "string", src: "'(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\"" },
        { cls: "variable", src: "\\$[a-zA-Z_]\\w*" },
        {
          cls: "keyword",
          src: "\\b(?:function|return|if|else|elseif|foreach|for|while|class|public|private|protected|static|const|new|echo|use|namespace|try|catch|throw|extends|implements|interface|true|false|null|array|void|int|string|bool|float|declare|strict_types)\\b",
        },
        { cls: "function", src: "\\b[a-zA-Z_]\\w*(?=\\s*\\()" },
        { cls: "number", src: "\\b\\d+(?:\\.\\d+)?\\b" },
      ],
      bash: [
        { cls: "comment", src: "#[^\\n]*" },
        { cls: "string", src: "'(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\"" },
        {
          cls: "function",
          src: "\\b(?:sudo|php|systemctl|service|apt|docker|grep|cat|echo|cd|ls|curl|find|wc)\\b",
        },
        { cls: "attr", src: "--?[a-zA-Z][\\w-]*" },
        { cls: "variable", src: "\\$\\w+" },
      ],
      ini: [
        { cls: "comment", src: ";[^\\n]*" },
        { cls: "tag", src: "^\\s*\\[[^\\]]+\\]" },
        { cls: "property", src: "^\\s*[\\w.]+(?=\\s*=)" },
        { cls: "keyword", src: "\\b(?:On|Off|true|false)\\b" },
        { cls: "number", src: "\\b\\d+[MKG]?\\b" },
      ],
      sql: [
        { cls: "comment", src: "--[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" },
        { cls: "string", src: "'(?:\\\\.|[^'\\\\])*'" },
        {
          cls: "keyword",
          src: "\\b(?:SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|CROSS|ON|USING|AND|OR|NOT|IN|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|UNIQUE|DROP|ALTER|ADD|COLUMN|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|AUTO_INCREMENT|NULL|IS|LIKE|BETWEEN|EXISTS|CASE|WHEN|THEN|ELSE|END|EXPLAIN|ANALYZE|BEGIN|START|TRANSACTION|COMMIT|ROLLBACK|SAVEPOINT|LOCK|FOR|SHARE|NOWAIT|ISOLATION|LEVEL|READ|WRITE|COMMITTED|UNCOMMITTED|REPEATABLE|SERIALIZABLE|ASC|DESC|INT|INTEGER|BIGINT|SMALLINT|TINYINT|DECIMAL|NUMERIC|VARCHAR|CHAR|TEXT|DATE|DATETIME|TIMESTAMP|BOOLEAN)\\b",
        },
        { cls: "function", src: "\\b[a-zA-Z_]\\w*(?=\\s*\\()" },
        { cls: "number", src: "\\b\\d+(?:\\.\\d+)?\\b" },
      ],
      rust: [
        { cls: "comment", src: "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" },
        { cls: "string", src: "r#*\"[\\s\\S]*?\"#*|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'])'" },
        {
          cls: "keyword",
          src: "\\b(?:fn|let|mut|const|static|struct|enum|trait|impl|for|while|loop|if|else|match|return|use|mod|pub|crate|super|self|Self|type|where|async|await|move|ref|in|break|continue|dyn|unsafe|extern|true|false|Box|Option|Result|Some|None|Ok|Err|Vec|String|str|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|Rc|Arc|Cell|RefCell|Mutex|RwLock|HashMap|HashSet|BTreeMap|BTreeSet|Cow|Pin|PhantomData)\\b",
        },
        { cls: "function", src: "\\b[a-zA-Z_]\\w*(?=\\s*\\()" },
        { cls: "number", src: "\\b\\d+(?:[._]\\d+)?(?:u8|u16|u32|u64|u128|usize|i8|i16|i32|i64|i128|isize|f32|f64)?\\b" },
      ],
      go: [
        { cls: "comment", src: "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" },
        { cls: "string", src: "`[^`]*`|\"(?:\\\\.|[^\"\\\\])*\"" },
        {
          cls: "keyword",
          src: "\\b(?:func|var|const|type|struct|interface|map|chan|go|select|defer|return|if|else|for|range|switch|case|default|break|continue|fallthrough|goto|package|import|make|new|nil|true|false|len|cap|append|copy|delete|panic|recover|close|error|any|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64|complex64|complex128|string|bool|byte|rune)\\b",
        },
        { cls: "function", src: "\\b[a-zA-Z_]\\w*(?=\\s*\\()" },
        { cls: "number", src: "\\b\\d+(?:\\.\\d+)?\\b" },
      ],
      redis: [
        { cls: "comment", src: "#[^\\n]*" },
        { cls: "string", src: "'(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\"" },
        {
          cls: "keyword",
          src: "\\b(?:SET|SETEX|SETNX|GETSET|GET|MSET|MGET|DEL|UNLINK|EXISTS|EXPIRE|PEXPIRE|TTL|PTTL|PERSIST|TYPE|RENAME|SCAN|KEYS|INCR|INCRBY|DECR|DECRBY|APPEND|STRLEN|LPUSH|RPUSH|LPOP|RPOP|BLPOP|BRPOP|LRANGE|LLEN|LREM|LINDEX|SADD|SREM|SMEMBERS|SISMEMBER|SCARD|SINTER|SUNION|SDIFF|SRANDMEMBER|SPOP|ZADD|ZREM|ZRANGE|ZREVRANGE|ZRANGEBYSCORE|ZRANK|ZREVRANK|ZSCORE|ZINCRBY|ZCARD|HSET|HGET|HMSET|HMGET|HGETALL|HDEL|HEXISTS|HINCRBY|HKEYS|HVALS|HLEN|SETBIT|GETBIT|BITCOUNT|PFADD|PFCOUNT|PFMERGE|XADD|XREAD|XRANGE|XLEN|SUBSCRIBE|PSUBSCRIBE|PUBLISH|MULTI|EXEC|DISCARD|WATCH|UNWATCH|FLUSHDB|FLUSHALL|DBSIZE|INFO|CONFIG|OBJECT)\\b",
        },
        { cls: "number", src: "\\b\\d+(?:\\.\\d+)?\\b" },
      ],
    };

    /* Qué alternativa del regex combinado ha casado: la primera cuyo grupo
       capturador viene definido. Ese índice es el de su regla. */
    function ruleOf(rules, groups) {
      const index = groups.findIndex((group) => group !== undefined);

      return index === -1 ? { cls: "default" } : rules[index];
    }

    function highlight(rawCode, language) {
      const rules = LANGUAGES[language];

      if (!rules) return escapeHtml(rawCode);

      const combined = new RegExp(rules.map((rule) => `(${rule.src})`).join("|"), "gm");

      let result = "";
      let lastIndex = 0;

      for (const match of rawCode.matchAll(combined)) {
        const [token, ...groups] = match;

        result += escapeHtml(rawCode.slice(lastIndex, match.index));
        result += `<span class="tok-${ruleOf(rules, groups).cls}">${escapeHtml(token)}</span>`;
        lastIndex = match.index + token.length;
      }

      return result + escapeHtml(rawCode.slice(lastIndex));
    }

    return {
      highlight,
      run() {
        for (const code of document.querySelectorAll("code[data-lang]")) {
          code.innerHTML = highlight(code.textContent, code.dataset.lang);
        }
      },
    };
  })();
})();
