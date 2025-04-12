import ollama

models = ollama.list()

print("Available Ollama Models:")
for model in models['models']:
    print(f"model : {model.model} \n")

client = ollama.Client()

while True:
    prompt = input("User : ")
    response = client.chat(
        model='tinyllama',
        messages=[
            {
                'role': 'user',
                'content': f"{prompt}"
            }
        ]
    )
    print(f"tinyllama :  {response['message']['content']}")