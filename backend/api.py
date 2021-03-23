from flask import Flask, render_template


app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)