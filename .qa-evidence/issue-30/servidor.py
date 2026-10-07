import http.server, sys, functools
from pathlib import Path
puerto, raiz, registro = int(sys.argv[1]), sys.argv[2], Path(sys.argv[3])

class Manejador(http.server.SimpleHTTPRequestHandler):
    def log_request(self, code="-", size="-"):
        ruta = Path(self.translate_path(self.path))
        bytes_enviados = ruta.stat().st_size if str(code) == "200" and ruta.is_file() else 0
        with registro.open("a") as fichero:
            fichero.write(f"{code}\t{bytes_enviados}\t{self.path}\n")

    def log_message(self, *args):
        pass

http.server.ThreadingHTTPServer(("127.0.0.1", puerto), functools.partial(Manejador, directory=raiz)).serve_forever()
