from flask_restx import Resource
from flask import request, render_template, Response,jsonify
import requests
import openai
import os
from llama_index import GPTSimpleVectorIndex
from llama_index import Document
import json
import re


os.environ["OPENAI_API_KEY"] = "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"
openai.organization = "org-Ddi6ZSgWKe8kPZlpwd6M6WVe"
openai.api_key = os.getenv("OPENAI_API_KEY")


def retrieveKeystore() -> dict:
    json_path = "/Users/bhargavkrish/Desktop/USC/hackathon/Own-Your-Terms/Backend/database.json"
    with open(json_path,'r') as j:
        database_json = json.loads(j.read())
    if "vector_store" in database_json:
        a = database_json["vector_store"]
        if "__data__" in a:
            b = a["__data__"]
            if "simple_vector_store_data_dict" in b:
                c = b["simple_vector_store_data_dict"]
                if "text_id_to_doc_id" in c:
                    d = c["text_id_to_doc_id"]
                    return d
    return {}


class Query(Resource):
    def post(self):
        data = json.loads(request.get_data())
        data = data['query']
        res = ""
        if os.path.exists("database.json"):
            existing_index = GPTSimpleVectorIndex.load_from_disk('database.json')
            safety_query = "Make coherant answers and seperate individual points by semi-colon."
            res = existing_index.query(data+safety_query)
            # print(res.get_formatted_sources(length=10000))
            sources = res.get_formatted_sources(length=10000)
            text_id_strings = re.findall(r'\((.*?)\)',sources)
            # print(text_id_strings)
            text_ids = []
            doc_ids = []
            for text_id_string in text_id_strings:
                if ":" in text_id_string:
                    text_id = text_id_string.split(":")[1]
                    text_ids.append(text_id)
                    print(text_id)
            keystore = retrieveKeystore()
            # print(keystore)
            for t in text_ids:
                print(t)
                t = t.lstrip(" ")
                t = t.rstrip(" ")
                if t in keystore:
                    print("Keystore: "+keystore[t])
                    doc_ids.append(keystore[t])
                            
            # print(doc_ids)
            print("Idhu res:\n ")
            print(res)
            print("Idhu dict:\n ")
            respo = res.response
            respo = respo.rstrip("\n")
            respo = respo.lstrip("\n")
            print(respo)
            dictt = {"result":str(respo).split(";"),"urls":doc_ids}
            #print(str(dictt))
            return json.dumps(dictt),200
        else:
            return "Database not found", 404
    
        
