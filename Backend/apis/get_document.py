from flask_restx import Resource
from flask import request, render_template, Response, jsonify
import requests
import os
import json

class GetDocument(Resource):
    def post(self):
        data = json.loads(request.get_data())
        userid_title_combination = data['user_id_title']
        userid_title_combination.lstrip(' ')
        userid_title_combination.rstrip(' ')
        file_name = str(hash(userid_title_combination))+".txt"
        response = {}
        if os.path.exists(file_name):
            with open(file_name,'r') as fptr:
                content = fptr.read()
                response = {
                    "response":content
                }
                return response,200
        else:
            response = {
                "response":""
            }
        return response,404


