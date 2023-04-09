from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from apis.store import Store
from apis.query import Query
from apis.get_titles import GetTitles

app = Flask(__name__)
cors = CORS(app, resource={
    r"/*": {
        "origins": "*"
    }
})

api = Api(app, version='1.0')
api.add_resource(Store, '/store')
api.add_resource(Query,'/query')
api.add_resource(GetTitles,'/get_titles')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
