import asyncio
import websockets

async def send_message():
    uri = "ws://localhost:8765"
    session_id=input('Enter Session: ')
    async with websockets.connect(uri) as websocket:
        # Start chatting
        await websocket.send(session_id)
        while True:
            user_input = input("User: ")

            # Send user input to the server
            await websocket.send(user_input)

            # Receive response from the server
            response = await websocket.recv()
            print(f"Server: {response}")

            # Break the loop if user inputs "quit"
            if user_input.lower() == "quit":
                break

if __name__ == "__main__":
    asyncio.run(send_message())