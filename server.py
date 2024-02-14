import asyncio
import websockets
import openai  # Import the OpenAI library
import os
import langchain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import GPT4AllEmbeddings
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms.openai import OpenAI
from langchain.embeddings import VertexAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.document_loaders import PyPDFLoader
from langchain.llms import Replicate
from langchain.chains import ConversationalRetrievalChain
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
import sqlite3
from datetime import datetime
import json
#from langchain_community.document_loaders import GCSFileLoader
from langchain.text_splitter import CharacterTextSplitter
from google.cloud.storage import Client
from PyPDF2 import PdfReader
import io
from langchain_google_vertexai import VertexAI
#nlp_tensorflow_keras imports
from keras.models import load_model
from keras.layers import Dense
from keras.models import Sequential
import warnings
import pickle
import json
import numpy as np
import tensorflow as tf
import random
import nltk
import pymongo
nltk.download('punkt')
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()

with open ('config.json') as file:
    config=json.load(file)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "lumen-b-ctl-047-e2aeb24b0ea0.json"
os.environ['OPENAI_API_KEY'] = config['api']['openai']
cluster_uri = "mongodb+srv://prodapt:prodapt@prodapt.ggtxnlg.mongodb.net/?retryWrites=true&w=majority"
client = pymongo.MongoClient(cluster_uri)
db = client['sample_mflix']

# client = Client()
# bucket = client.get_bucket(config['bucket'])
# blob = bucket.get_blob(config['blob'])
# content = blob.download_as_string()
# pdf_stream = io.BytesIO(content)
# pdfreader = PdfReader(pdf_stream)

# raw_text = ""
# for i, page in enumerate(pdfreader.pages):
#     content = page.extract_text()
#     if content:
#         raw_text += content

# text_splitter = CharacterTextSplitter(
#     separator="\n",
#     chunk_size=800,
#     chunk_overlap=200,
#     length_function=len,
# )
 
# texts = text_splitter.split_text(raw_text)

# vectorstore = Chroma.from_texts(texts, embedding=OpenAIEmbeddings())


# #openai.api_key = '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'
# # llm = VertexAI(model_name="gemini-pro")
# llm = OpenAI(model="gpt-3.5-turbo-instruct")

# qa_chain = ConversationalRetrievalChain.from_llm(
#     llm,
#     vectorstore.as_retriever(search_kwargs={'k': 2}),
#     return_source_documents=True
# )

conn = sqlite3.connect('conversation.db')

# Create a cursor object to interact with the database
cursor = conn.cursor()

# Create a table for storing conversation data if it doesn't exist
cursor.execute('''CREATE TABLE IF NOT EXISTS conversation (
                    id INTEGER PRIMARY KEY,
                    session_id TEST,
                    datetime TIMESTAMP,
                    role TEXT,
                    content TEXT,
                    question TEXT,
                    answer TEXT
                )''')

item={"role": "system", "content": "You are a helpful assistant."}

with open('intents.json') as json_data:
    intents  = json.load(json_data)

try:
    data = pickle.load(open("training_data", "rb"))
    words = data['words']
    classes = data['classes']
    train_x = data['train_x']
    train_y = data['train_y']
except Exception as e:
    print("Error occured while loading pickle data: ", e)
    exit(1)

# load our saved model
print("Loading the Model......")
try:
    model = load_model('./model.keras')
except Exception as e:
    print("Error occured while loading the model: ", e)
    exit(1)

def entity_finder(query: str):
    model = ChatOpenAI()
    prompt = PromptTemplate.from_template("""For the following input I want you to give me a response in json format following the example that I give: 
    example input: "Assign a task to raghunandan in sfcc project."
    example response: "resource" : "Raghunandan", "project": "SFCC"
    example input: "what is the task assigned to Mitchell"
    example response: "resource" : "Mitchell", "project": ""
    input: {input}""")
    chain = LLMChain(llm=model, prompt=prompt)
    response = chain.run(input = query)
    return json.loads(response)

def intent_classification(query):
    model = VertexAI(model_name="gemini-pro")
    template = """If the user input matches any of the following intents: "generic_text", "open_settings", "goto_homescreen", "assign_task", "show_details"
    then return the corresponding intent tag string as the output.

    For example:
    - If the user asks a generic question comprising of general topics, asking to elaborate/breakdown/in-depth, then the model should output "generic_text".
    - If the user input is "open_settings", the model should output "open_settings".
    - If the user input is "Can you assign a task?", the model should output "assign_task".
    - If the user input is "go/navigate/open to homescreen/homepage, the model should output "goto_homescreen"
    - If the user input is like "show/display/list [names]/accounts etc., that seems specific, the model should output "show_details".
    - If the user input does not match any of the specified intents, the model should output an empty string ("").
    user input : {query}
    """
    prompt = PromptTemplate.from_template(template)

    chain = prompt | model
    recognized_intent = chain.invoke({"query" : query})
    print(f"Recognized_intent: {recognized_intent}")
    return recognized_intent
def generic_response(query):
    prompt = PromptTemplate.from_template("""You are a helpful assistant that helps managers to do their tasks such as assigning tasks, queries . Be a bit human-like
                                Manager: {input}""")
    model = ChatOpenAI()
    chain = LLMChain(llm=model, prompt=prompt)

    response = chain.run(input = query)
    return response


# Get account name for project
def get_account_name_for_project(project_name):
    # Query the "projects" collection to find the project by its name
    # Access the "projects" collection
    projects_collection = "projects"

    # Access the "accounts" collection
    accounts_collection = "accounts"
    project_query = {"name": project_name}
    project = db[projects_collection].find_one(project_query)

    if project:
        # Get the accountId from the project document
        account_id = project.get("accountId")
        account_id = int(account_id)
        # Query the "accounts" collection to find the account by its ID
        account_query = {"_id": account_id}
        account = db[accounts_collection].find_one(account_query)

        if account:
            # Get the account name from the account document
            account_name = account.get("name")
            return account_name
        else:
            return "Account not found"
    else:
        return "Project not found"

# GET PROJECTS BY NAME

def get_projects_by_resource_name(resource_name):

    # Establish connection to MongoDB
    # Define collections and relationships (assuming correct collection names)
    resource_collection = "resources"
    project_collection = "projects"
    resource_field = "name"  # Assuming field storing resource name in the resource collection

    # Find the resource and extract project IDs
    query = {resource_field: resource_name}
    projection = {"_id": 0, "projects": 1}  # Project only the "projects" field
    resource = db[resource_collection].find_one(query, projection=projection)

    if resource:
        project_ids = resource.get("projects", [])

        if project_ids:
            # Find project names based on project IDs
            projects = db[project_collection].find({"_id": {"$in": project_ids}})
            project_names = [project.get("name", "No project name found") for project in projects]

            if project_names:
                return project_names
            else:
                return ["No projects found for the associated project IDs: {}".format(project_ids)]
        else:
            return ["No projects associated with the resource: {}".format(resource_name)]
    else:
        return ["Resource not found with the name: {}".format(resource_name)]

# Get tasks by resource name
def get_tasks_by_resource_name(resource_name):

    # Define collections and relationships (assuming correct collection names)
    resource_collection = "resources"
    task_collection = "tasks"
    resource_field = "name"  # Assuming field storing resource name in the resource collection

    # Find the resource and extract task IDs
    query = {resource_field: resource_name}
    projection = {"_id": 0, "tasks": 1}  # Project only the "tasks" field
    resource = db[resource_collection].find_one(query, projection=projection)

    if resource:
        task_ids = resource.get("tasks", [])
        
        # Find task names based on task IDs
        task_query = {"_id": {"$in": task_ids}}
        task_projection = {"_id": 0, "name": 1}
        tasks = db[task_collection].find(task_query, projection=task_projection)
        
        task_names = [task["name"] for task in tasks]
        return task_names
    else:
        return []
    
#get account by Name

def get_accountId_by_resource_name(resource_name):

    # Define collections and relationships (assuming correct collection names)
    resource_collection = "resources"
    account_collection = "accounts"
    resource_field = "name"  # Assuming field storing resource name in the resource collection
    account_field = "account"  # Assuming field storing account ID in the resource collection

    # Find the resource and extract account ID
    query = {resource_field: resource_name}
    projection = {"_id": 0, account_field: 1}  # Project only the "accounts" field
    resource = db[resource_collection].find_one(query, projection=projection)

    if resource:
        account_id = int(resource.get(account_field))

        if account_id:
            account = db[account_collection].find_one({"_id": account_id})

            if account:
                return account.get("_id", "No account name found")
            else:
                return "No account found for the associated account ID: {}".format(account_id)
        else:
            return "No account associated with the resource: {}".format(resource_name)
    else:
        return "Resource not found with the name: {}".format(resource_name)
    
#Get all resource details by name
    
def get_resource_details(resource_name):
    # Define collections and relationships (assuming correct collection names)
    resource_collection = "resources"
    project_collection = "projects"
    task_collection = "tasks"
    account_collection = "accounts"
    resource_field = "name"  # Assuming field storing resource name in the resource collection
    account_field = "account"  # Assuming field storing account ID in the resource collection

    # Find the resource and extract project IDs, task IDs, and account ID
    query = {resource_field: resource_name}
    projection = {"_id": 0, "projects": 1, "tasks": 1, account_field: 1}  # Project only the required fields
    resource = db[resource_collection].find_one(query, projection=projection)

    if resource:
        # Extract project IDs, task IDs, and account ID
        project_ids = resource.get("projects", [])
        task_ids = resource.get("tasks", [])
        account_id = resource.get(account_field)

        # Find project details based on project IDs
        projects = db[project_collection].find({"_id": {"$in": project_ids}})
        project_details = [{"name": project["name"], "id": project["_id"]} for project in projects]

        # Find task details based on task IDs
        task_query = {"_id": {"$in": task_ids}}
        task_projection = {"_id": 0, "name": 1, "start_date": 1, "end_date": 1, "status": 1, "projectId": 1}
        tasks = db[task_collection].find(task_query, projection=task_projection)
        task_details = []

        # Find account name based on account ID
        if account_id:
            account = db[account_collection].find_one({"_id": int(account_id)})
            account_name = account.get("name", "No account name found")
        else:
            account_name = "No account associated with the resource"

        # Prepare task details with account name included in each task object
        for task in tasks:
            task_details.append({
                "name": task["name"],
                "start_date": task["start_date"],
                "end_date": task["end_date"],
                "status": task.get("status", "No status found"),
                "project": next((proj["name"] for proj in project_details if proj["id"] == task["projectId"]), "No project found"),
                "account_name": account_name  # Include account name in each task object
            })

        return {"response_type": "table","response": {"task_details": task_details}}
    else:
        return {"response_type":"error", "response": "Resource not found with the name: {}".format(resource_name)}

def get_project_id_by_name(project_name):
    # Query the "projects" collection to find the project by its name
    projects_collection = db['projects']
    project_query = {"name": project_name}
    project = projects_collection.find_one(project_query)

    if project:
        # Get the _id from the project document
        project_id = project.get("_id")
        return project_id
    else:
        return None
def get_task_id_by_name(task_name):
    # Query the "tasks" collection to find the task by its name
    tasks_collection = db["tasks"]
    task_query = {"name": task_name}
    task = tasks_collection.find_one(task_query)

    if task:
        # Get the _id from the task document
        task_id = task.get("_id")
        return task_id
    else:
        return None  # Task not found

def get_resource_id_by_name(resource_name):
    # Query the "resources" collection to find the resource by its name
    resources_collection = db["resources"]
    resource_query = {"name": resource_name}
    resource = resources_collection.find_one(resource_query)

    if resource:
        # Get the _id from the resource document
        resource_id = resource.get("_id")
        return resource_id
    else:
        return None  # Resource not found

#get accountId by account Name

def get_account_id_by_name(account_name):
    # Replace with your actual database name

    # Access the "accounts" collection
    accounts_collection = db["accounts"]

    # Query the "accounts" collection to find the account by its name
    query = {"name": account_name}
    projection = {"_id": 1}  # Only retrieve the accountId field
    account = accounts_collection.find_one(query, projection=projection)

    if account:
        # Extract and return the accountId
        account_id = account["_id"]
        return account_id
    else:
        return None  

# def clean_up_sentence(sentence):
#     # It Tokenizes or Breaks it into the constituent parts of the Sentence.
#     sentence_words = nltk.word_tokenize(sentence)
#     # Stemming means to find the root of the word.
#     sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
#     return sentence_words


# ERROR_THRESHOLD = 0.25
# print("ERROR_THRESHOLD = 0.25")


# def bow(sentence, words, show_details=False):
#     sentence_words = clean_up_sentence(sentence)
#     bag = [0] * len(words)
#     for s in sentence_words:
#         for i, w in enumerate(words):
#             if w == s:
#                 bag[i] = 1
#                 if show_details:
#                     print("found in bag: %s" % w)
#     return np.array(bag)


# def classify(sentence):
#     # Prediction or To Get the Possibility or Probability from the Model
#     results = model.predict(np.array([bow(sentence, words)]))[0]
#     # Exclude those results which are Below Threshold
#     results = [[i, r] for i, r in enumerate(results) if r > ERROR_THRESHOLD]
#     # Sorting is Done because higher Confidence Answer comes first.
#     results.sort(key=lambda x: x[1], reverse=True)
#     return_list = []
#     for r in results:
#         # Tuple -> Intent and Probability
#         return_list.append((classes[r[0]], r[1]))
#     return return_lists


async def nlp_response(sentence, websocket):
    intent_tag = intent_classification(sentence)
    print(f"intent tag detected:{intent_tag}")
    is_intent = False
    for i in intents['intents']:
        # Tag Finding
        if i['tag'] == intent_tag:
            is_intent = True
            if intent_tag == 'assign_task':
                print(json.dumps(i['responses'][0]))
                defined_entities = i['responses'][0]
                found_entities = entity_finder(sentence)
                defined_entities['response']["resourceName"] = found_entities["resource"]
                defined_entities['response']["projectName"] = found_entities["project"]
                defined_entities['response_type'] = "Json-Questions"
                # await websocket.send(json.dumps(i['responses'][0]))
                await websocket.send(json.dumps(defined_entities))
                # task_details = await websocket.recv()
                # task_details= json.loads(task_details)
                # # task_details['response_type']={"response_type": "API call", "response": "Task assigned successfully"}
                # task_details['response']['projectId'] = get_project_id_by_name(task_details['response']['projectName'])
                # task_details['response']['resourceId'] = get_resource_id_by_name(task_details['response']['resourceName'])
                # task_details['response']['accountId'] = get_accountId_by_resource_name(task_details['response']['resourceName'])
                # api_response = {"response_type": "API call", "response": "Task assigned successfully"}
                # api_response['details']['projectId'] = task_details['response']['projectId']
                # api_response['details']['resourceId'] = task_details['response']['resourceId']
                # api_response['details']['accountId'] = task_details['response']['accountId']
                # api_response['details']['start_date'] = task_details['response']['start_date']
                # api_response['details']['end_date'] = task_details['response']['end_date']
                # api_response['details']['status'] = task_details['response']['status']


                task_details = await websocket.recv()
                task_details = json.loads(task_details)

                # Assuming get_project_id_by_name, get_resource_id_by_name, and get_accountId_by_resource_name functions are defined elsewhere

                task_details['response']['projectId'] = get_project_id_by_name(task_details['response']['projectName'])
                task_details['response']['resourceId'] = get_resource_id_by_name(task_details['response']['resourceName'])
                task_details['response']['accountId'] = get_accountId_by_resource_name(task_details['response']['resourceName'])

                api_response = {"response_type": "API call", "response": "Task assigned successfully"}

                # Initialize the 'details' property as an empty dictionary
                api_response['details'] = {}

                # Assign values to the sub-properties
                api_response['details']['projectId'] = task_details['response']['projectId']
                api_response['details']['resourceId'] = task_details['response']['resourceId']
                api_response['details']['accountId'] = task_details['response']['accountId']
                api_response['details']['start_date'] = task_details['response']['start_date']
                api_response['details']['end_date'] = task_details['response']['end_date']
                api_response['details']['status'] = task_details['response']['status']


                # task_details['details']['task_id'] = get_task_id_by_name(task_details['details']['task']) 
                        
                
                # for key, value in task_details.items():
                #     print(f"{key} : {value}\n")
                #     await websocket.send(f"{key} : {value}\n")

                return json.dumps(api_response)
            elif intent_tag == 'show_details':
                found_entities = entity_finder(sentence)
                details_json= {
                    "response_type":"question",
                    "response":["Can u confirm the name again?"]
                }
                await websocket.send(json.dumps(details_json))
                details_list = await websocket.recv()
                details_list =  json.loads(details_list)
                resource_details = get_resource_details(details_list[0]['answer'])
                return json.dumps(resource_details)                        
            else:
                response = {"response_type":"message", "response": random.choice(i["responses"])}
                return json.dumps(response)
    if is_intent == False:
        return False

async def handle_client(websocket, path):
    cursor = conn.cursor()
    session_id = await websocket.recv()    
    print(f"Received session ID: {session_id}")
    while True:
        # session_id=int(session_id)
        cursor.execute("SELECT role, content FROM conversation WHERE session_id = ? AND role IS NOT NULL AND content IS NOT NULL ORDER BY datetime ASC", (session_id,))
        rows = cursor.fetchall()
        if rows:
            # If session_id exists, retrieve the data
            print(f"Session ID {session_id} exists. Retrieving data:")
        # Display the retrieved data
            messages = [{ 'role': row[0], 'content': row[1]} for row in rows]
            break
        else:
            # cursor.execute("INSERT INTO conversation (session_id, datetime, role, content) VALUES (?, ?, ?, ?)",
            #                 session_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), item['role'], item['content'])            
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute("INSERT INTO conversation (session_id, datetime, role, content,question,answer) VALUES (?, ?, ?, ?, ?, ?)",
                        (session_id, current_time, item['role'], item['content'],None,None))

            # Commit changes to the database
            conn.commit()
            print("New data inserted.")
    print('---Fetched data---')
    print("Client connected")
    # messages = [{"role": "system", "content": "You are a helpful assistant."}]
    cursor.execute("SELECT question,answer FROM conversation WHERE session_id = ? AND question IS NOT NULL AND answer IS NULL ORDER BY datetime ASC",(session_id,))
    chat_history = cursor.fetchall()
    # chat_history = []
    print('------Chat History Fetched-------')

    async for message in websocket:
        print(f"Received message from client: {message}")
        
        # Handle received message from the client
        if message.lower() == "quit":
            break
        
        nlp_result = await nlp_response(message, websocket)
        if nlp_result != False:
            try:
                response = nlp_result[0]['response']
                chat_history.append((message, response))
            except: #to handle string response
                response = nlp_result
                chat_history.append((message, response))
        else: 
            # results = vectorstore.similarity_search_with_score(message)
            # print(results)
            #print(results)
            # Find the document with the maximum score
            # max_score = -1.0
            # max_document_id = -1
            # for document_id, score in results:
            #     if (score > max_score) and (score<=1):
            #         max_score = score
            #         max_document_id = document_id
            # # Pass the message to the chatbot function
            # print(max_score, max_document_id)
            # if max_score ==-1.0 or max_score>1.0: #invalid max_score
            #     messages.append({"role": "user", "content": message})
            #     current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            #     cursor.execute("INSERT INTO conversation (session_id, datetime, role, content,question,answer) VALUES (?, ?, ?, ?, ?, ?)",
            #             (session_id, current_time, 'user', message, None,None))

            #     # Commit changes to the database
            #     conn.commit()
            #     response = openai.ChatCompletion.create(
            #     model="gpt-3.5-turbo-0613",
            #     messages=messages)
            #     chat_message = response['choices'][0]['message']['content']
            #     print(f"GPT: {chat_message}")
            #     messages.append({"role": "assistant", "content": chat_message})
            #     current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            #     cursor.execute("INSERT INTO conversation (session_id, datetime, role, content,question,answer) VALUES (?, ?, ?, ?, ?, ?)",
            #             (session_id, current_time, 'assistant', chat_message,None,None))

            #     # Commit changes to the database
            #     conn.commit()
            #     response=chat_message
            #     print('---gpt---')
            # else: #proper max_score
            result = generic_response(message)
            print('GPT:' + result)
            chat_history.append((message, result))
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute("INSERT INTO conversation (session_id, datetime, role, content,question,answer) VALUES (?, ?, ?, ?, ?, ?)",
                    (session_id, current_time,None, None,message,result))

            # Commit changes to the database
            conn.commit()
            response = {"response_type" : "message", "response": f"""{result}"""}
            response= json.dumps(response)
            print('---llama---')
        # response = chatbot(messages, chat_history, message)
        print(f"Sending response to client: {response}")

        # Send a response back to the client
        await websocket.send(response)
        # try:
        #     # response = json.loads(response)
        #     await websocket.send(response)
        #     # for key, value in response.items():
        #     #     print(f"{key} : {value}")
        #     #     await websocket.send(f"{key} : {value}")
        # except:
        #     await websocket.send(response)

if __name__ == "__main__":
    start_server = websockets.serve(handle_client, "localhost", 8655,ping_interval=None)
    print("WebSocket server started. Listening on localhost:8655")
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()