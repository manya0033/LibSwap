For this task, I individually Dockerised the LibSwap group project so that the complete application could run in a containerised environment. I used the Node.js 22 Alpine image because it provides the required Node.js runtime while keeping the Docker image relatively lightweight. I used npm ci instead of npm install so that dependencies are installed consistently from the existing package-lock.json.



I created a .dockerignore file to prevent unnecessary or sensitive files such as node\_modules, Git metadata and the local .env file from being copied into the Docker image. Runtime configuration is instead supplied using Docker's --env-file option. This allowed MongoDB Atlas and JWT configuration to remain outside the image and public GitHub repository. MongoDB Atlas remained an external database service, while the Dockerised Express application connected to it at runtime.



One challenge was that my Docker version initially contained the backend APIs but not the completed catalogue frontend because the frontend work had not yet been merged into the group repository. After the catalogue pull request was merged, I synchronised the latest group main into my Docker branch while preserving both the static frontend serving and the required /api/student endpoint. I then rebuilt the Docker image and confirmed that the catalogue interface could retrieve real book data from MongoDB.



I also encountered configuration issues during testing. MongoDB initially rejected a local connection because my current IP address was not authorised in Atlas, which I resolved through the Atlas Network Access settings. Login testing also revealed that JWT\_SECRET was missing from my local runtime configuration. After adding the required JWT variables to my private .env file and recreating the container, registration and login both worked successfully.



The most rewarding part of the task was seeing the complete flow operate successfully from the browser frontend, through the Express server running inside Docker, to the MongoDB Atlas database. It helped me understand the difference between building an application locally and packaging it so that another person can reproduce the same environment using documented Docker instructions.



