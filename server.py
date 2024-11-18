from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

@app.route('/')
def index():
   return render_template('index.html')   


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)