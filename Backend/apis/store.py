from flask_restx import Resource
from flask import request, render_template, Response
import requests
import openai
import os
from llama_index import GPTChromaIndex
from llama_index import Document

import chromadb
# setup Chroma in-memory, for easy prototyping. Can add persistence easily!
client = chromadb.Client()

# Create collection. get_collection, get_or_create_collection, delete_collection also available!
collection = client.create_collection("all-my-documents") 


class Store(Resource):
    def post(self):
        data = request.json
        print(data)
        
        llama_doc = Document(data)
        index = GPTChromaIndex.from_documents(documents=[llama_doc], chroma_collection=collection)
        #index.insert(llama_doc)
        question = "Highlight atleast 5 red flags in this terms and conditions."
        res = index.query(question)
        print(res)


        

        return res, 200

