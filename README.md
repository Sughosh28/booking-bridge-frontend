# Event Booking Backend

This is the backend for the Event Booking project, which can be run using Docker. It interacts with a database (which you can configure to use either a local or cloud-based solution such as AWS RDS).

## Prerequisites

Before running the Docker container, ensure you have the following:

- **Docker** installed on your system. [Install Docker](https://www.docker.com/get-started)


## Running the Project

Follow these steps to run the backend in Docker:

### 1. Build the Docker image
If you haven't already built the Docker image, you can do so with the following command:


docker build -t event-booking .

docker run -p 8089:8089 event-booking


And then access the frontend vercel link which you can see in the description.
