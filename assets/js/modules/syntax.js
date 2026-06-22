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

    function highlight(rawCode, language) {
      const rules = LANGUAGES[language];

      if (!rules) {
        return escapeHtml(rawCode);
      }

      const combined = new RegExp(
        rules
          .map(function (rule) {
            return "(" + rule.src + ")";
          })
          .join("|"),
        "gm"
      );

      let result = "";
      let lastIndex = 0;

      rawCode.replace(combined, function () {
        const match = arguments[0];
        const offset = arguments[arguments.length - 2];

        result += escapeHtml(rawCode.slice(lastIndex, offset));

        let cls = "default";

        for (let group = 1; group < arguments.length - 2; group++) {
          if (arguments[group] !== undefined) {
            cls = rules[group - 1].cls;
            break;
          }
        }

        result +=
          '<span class="tok-' + cls + '">' + escapeHtml(match) + "</span>";
        lastIndex = offset + match.length;

        return match;
      });

      result += escapeHtml(rawCode.slice(lastIndex));

      return result;
    }

    return {
      run: function () {
        document.querySelectorAll("code[data-lang]").forEach(function (code) {
          code.innerHTML = highlight(code.textContent, code.dataset.lang);
        });
      },
    };
  })();
})();
