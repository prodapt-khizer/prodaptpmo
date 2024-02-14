# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory to /app

# Copy the current directory contents into the container at /app
COPY . /

RUN chmod a+r /lumen-b-ctl-047-5976514b2448.json
# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8765 available to the world outside this container
EXPOSE 8765
CMD python3 server.py
