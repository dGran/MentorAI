/* ============================================================
   MentorAI — Ponlo en práctica: mini-retos por curso
   Cada clave es el slug de un curso; cada reto tiene enunciado y
   solución en texto plano (los escapa el renderer) y código opcional
   { lang, source } que se resalta con SyntaxHighlighter.
   Se pintan al final de la ficha del curso (assets/js/modules/practica.js).
   ============================================================ */

window.MENTORAI_PRACTICE = {
  "terminal-linux": [
    {
      title: "El fichero que se come el disco",
      statement:
        "El disco de un servidor está al 92% y nadie sabe por qué. Sin abrir ningún explorador gráfico, encuentra los 5 ficheros más pesados que cuelgan de /var en tu máquina (o de tu $HOME si no tienes permisos). Pista: no es lo mismo el tamaño de un directorio que el de un fichero.",
      solution:
        "du -ah recorre el árbol mostrando el tamaño de cada fichero y directorio; sort -rh ordena por tamaño legible (entiende K, M, G) de mayor a menor, y head corta los 5 primeros. La alternativa con find -type f -size +100M lista solo ficheros grandes, pero no los ordena: por eso el pipeline con du es la herramienta habitual de diagnóstico.",
      solutionCode: {
        lang: "bash",
        source: "du -ah /var 2>/dev/null | sort -rh | head -n 5",
      },
    },
    {
      title: "El permiso que falta no es el que parece",
      statement:
        "Reproduce esta situación y explica por qué falla el cat: el fichero tiene permiso de lectura para todos y aun así no se puede leer. Arréglalo tocando un solo permiso.",
      code: {
        lang: "bash",
        source:
          "mkdir caja\necho \"secreto\" > caja/nota.txt\nchmod 644 caja/nota.txt\nchmod 600 caja\ncat caja/nota.txt   # Permission denied, ¿por qué?",
      },
      solution:
        "Para llegar a nota.txt hay que atravesar el directorio caja, y atravesar un directorio exige su bit x (ejecución). Con chmod 600 el directorio se queda sin él, así que da igual que el fichero sea legible: no se puede llegar hasta él. Se arregla devolviendo el bit x al dueño; en directorios lo normal es r y x juntos (700 o 755).",
      solutionCode: {
        lang: "bash",
        source: "chmod 700 caja\ncat caja/nota.txt",
      },
    },
    {
      title: "Un pipeline con datos de verdad",
      statement:
        "Usando solo cut, sort, uniq y head sobre /etc/passwd, saca cuántos usuarios de tu sistema usan cada shell, ordenado de más a menos. Te dirá cuántas cuentas de servicio hay frente a usuarios reales.",
      solution:
        "El campo 7 de /etc/passwd es la shell, separada por dos puntos. uniq -c cuenta líneas repetidas, pero solo si están juntas: por eso el primer sort es obligatorio antes de uniq, y el segundo ordena el recuento. Este patrón cortar → ordenar → contar → ordenar por frecuencia sirve igual para logs de acceso, IPs o user agents.",
      solutionCode: {
        lang: "bash",
        source: "cut -d: -f7 /etc/passwd | sort | uniq -c | sort -rn",
      },
    },
  ],
};
