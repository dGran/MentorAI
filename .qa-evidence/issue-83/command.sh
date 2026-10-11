#!/usr/bin/env bash
node assets/cpl4.js http://localhost:8000 ag-del-requisito-al-issue goroutines tipos-de-test sql-joins hexagonal-en-php > assets/c1-caracteres-por-linea.txt
node assets/skip.js http://localhost:8000 > assets/c2-skip-link-y-main.txt
