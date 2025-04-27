# UI Documentation

## Local Setup

1. Install Node.js and npm from [here](https://nodejs.org/en/download/).
2. Install Angular CLI by running the following command:
    ```bash
    npm install -g @angular/cli
    ```
3. Install the required dependencies by running the following command:
    ```bash
    npm install
    ```
4. Run the development server by running the following command:
    ```bash
    ng serve
    ```
5. Open the browser and navigate to `http://localhost:4200/`.

## Docker Setup

1. Build the Docker image by running the following command:
    ```bash
    docker build -t abhirambsn/indie-desk-ui .
    ```
   
2. Run the Docker container by running the following command:
    ```bash
    docker run -p 80:80 abhirambsn/indie-desk-ui
    ```
3. Open the browser and navigate to `http://localhost/`.