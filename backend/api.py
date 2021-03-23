from flask import Flask, render_template
from app import app

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)