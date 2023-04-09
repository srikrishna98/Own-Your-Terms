from flask_restx import Resource
from flask import request, render_template, Response
import requests
import openai
import os
from llama_index import GPTSimpleVectorIndex
from llama_index import Document
import json

os.environ["OPENAI_API_KEY"] = "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"
openai.organization = "org-Ddi6ZSgWKe8kPZlpwd6M6WVe"
openai.api_key = os.getenv("OPENAI_API_KEY")




class Query(Resource):
    def post(self):
        data = json.loads(request.get_data())
        data = data['query']
        res = ""
        if os.path.exists("database.json"):
            existing_index = GPTSimpleVectorIndex.load_from_disk('database.json')
            res = existing_index.query(data)
            print(res.get_formatted_sources(length=1000))
            return str(res),200
        else:
            return "Database not found", 404
    
        
