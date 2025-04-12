from flask import Flask, send_from_directory
from pathlib import Path

app = Flask(__name__, static_folder='../client/build/', static_url_path='/')

@app.route("/")
@app.route("/<path:path>")
def serve_react(path=""):
    root_dir = Path(app.static_folder)
    file_path = root_dir / path

    if file_path.exists() and file_path.is_file():
        return send_from_directory(root_dir, path)
    else:
        return send_from_directory(root_dir, "index.html")

