from flask_restx import Resource
from flask import request, render_template, Response
import openai
import os
import json
from llama_index import GPTChromaIndex, GPTSimpleVectorIndex
from llama_index import Document


os.environ["OPENAI_API_KEY"] = "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"
openai.organization = "org-Ddi6ZSgWKe8kPZlpwd6M6WVe"
openai.api_key = os.getenv("OPENAI_API_KEY")



class Store(Resource):
    def post(self):
        data = json.loads(request.get_data())
        linkID = data['link']
        data = data['TOS']
        llama_doc = Document(data,doc_id=linkID)
        index = GPTSimpleVectorIndex.from_documents(documents=[llama_doc])
        index.update(llama_doc)
        question = "Highlight atleast 5 red flags in this terms and conditions."
        res = index.query(question)
        if os.path.exists("database.json"):
            existing_index = GPTSimpleVectorIndex.load_from_disk('database.json')

            existing_index.update(llama_doc)
            existing_index.save_to_disk("database.json")
        else:
            index.save_to_disk("database.json")
        print(res)
        return str(res).split('\n'), 200

