# File Management System

## Overview

This project manages files and folders using PostgreSQL and AWS S3. The code is written in javascript in Nodejs. To increase extensibility and maintainability of the project,
seperate files are created to comply with SRP AND OCP.

## Features

- **Authentication**: Users can sign up and log in securely. JWT is used for authentication and bcrypt.
  
- **Manage folders and subfolders**: Users can add, delete and rename fodlers and sub folders.
  
- **Manage files**: Users can add, delete and rename files to already existing folders.

## Technologies Used

- **Backend**: Node.js, Express.js, PostgreSQL, AWS S3
- **Authentication**: JSON Web Tokens (JWT)
- **Encryptiont**: Bcrypt

## Project Structure

- **`/service`**: Backend server code, business logic to operate and manage files and folders
- **`/controllers`**: Decision making files based on request body and request parameters.
- **`/middleware`**: Middleware functions for authentication.
- **`/routes`**: Contains various routes based on the request params.
- **`/config`**: Contains files to initialize db and aws-sdk.
- **`/models`**: Contains files that have the necessary code for making entries into respective tables.

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQ
- AWS S3

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/muditpurohitt/File-management-system.git

2. **Install dependencies**

   ```bash
   cd File-management-system
   npm install
   
  (install all the necessary dependencies)
    
3. **Start the server**
   ```bash
   cd src
   node app.js
  

## API Endpoints

- **`POST /auth/signup`**: Sign up a new user.
- **`POST /auth/login`**: Log in an existing user.
- **`POST /folders/add/`**: Adds files, folders or subfolders to the db and aws server based on the attributes in the request body.
- **`DELETE /folders/file/:fileId`**: Delete the file.
- **`DELETE /folders/file/:folderId`**: Delete the folder, subfolders and files.
- **`PUT /folders/file/:fileId`**: Rename the file and change the path.
- **`PUT /folders/file/:folderId`**: Rename the folder, change the path and path of all the subfloders and files.


## Schema and tables

- **users**: This table contains the username, email, password.
- **files**: This table contains - name, folder_id(id of parent folder), user_id, path(path to the file).
- **folders**: This table contains - name, parentfolder_id(id of parent folder), user_id, path(path to the folder).

## Contributions

Contributions are welcome! If you find a bug or want to add new features, please open an issue or submit a pull request.

   
