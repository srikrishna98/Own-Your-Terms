from flask_restx import Resource
from flask import request, render_template, Response, jsonify
import requests
import os
import json

class GetTitles(Resource):
    def post(self):
        data = json.loads(request.get_data())
        userid = data['userid']
        alreadyPresentList = []
        userDataJson = {}
        userid = userid.rstrip(" ")
        userid = userid.lstrip(" ")

        print("userid",userid)
        if os.path.exists("./userData.json"):
            with open('userData.json') as userDataJsonFile:
                userDataJson = json.loads(userDataJsonFile.read())
                if userid in userDataJson:
                    alreadyPresentList = userDataJson[userid]
                    print(str(alreadyPresentList))
        print("ngomaa "+str(alreadyPresentList))
        response = {
            "response":alreadyPresentList
        }
        return response,200