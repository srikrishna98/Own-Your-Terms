from flask_restx import Resource
from flask import request, render_template, Response
import requests


class Store(Resource):
    def post(self):
        data = request.json
        print(data)
        return "Success", 200
