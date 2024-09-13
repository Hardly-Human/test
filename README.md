# 🌟 Image Sharing Platform

Welcome to the **Image Sharing Platform**, a web application where users can upload, view, and share images! This project is built using modern technologies like Node.js, TypeScript, PostgreSQL, TypeORM, and GraphQL. It utilizes AWS services (S3, ECS, and CloudFront) for image storage, deployment, and content delivery. User authentication is handled via Auth0.

## ✨ Features

- **User Authentication**: Auth0 for user registration, login, and logout.
- **Image Upload**: Authenticated users can upload images, stored securely in AWS S3.
- **Image Viewing**: A gallery showcasing uploaded images, with pagination support.
- **Image Sharing**: Share images via short URLs.
- **Image Details**: View image metadata and comments.
- **User Profiles**: Manage uploaded images from a personal profile page.
- **AWS Integration**: Seamless integration with AWS services for image storage, hosting, and content delivery.

## 🌐 Live Demo

Check out the live deployment of the Image Sharing Platform here: [Live Demo](http://34.41.246.31/)

## 🚀 Technologies Used

- **Backend**: Node.js, Express, TypeScript, TypeORM, PostgreSQL
- **Frontend**: EJS (Embedded JavaScript templates)
- **Authentication**: Auth0 with JWT tokens
- **Cloud**: AWS S3, ECS, CloudFront
- **Testing**: Jest for unit tests
- **Containerization**: Docker, Docker Compose
- **Infrastructure as Code**: Terraform

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** (version 14 or higher)
- **Docker** and **Docker Compose**
- **PostgreSQL** (local or hosted)
- **AWS Account** (for deploying to ECS, S3, CloudFront)
- **Auth0 Account** (for authentication)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/image-sharing-platform.git
   cd image-sharing-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy the `.env.example` file and rename it to `.env`.
   - Update the file with your own credentials (Auth0, PostgreSQL, AWS).

4. Run the application locally using Docker Compose:

   ```bash
   docker-compose up --build
   ```

5. Access the application at `http://localhost:3000`.

### Running Tests

To run the unit and integration tests, use the following command:

```bash
npm run test
```

## 🎯 Usage

- **Upload Images**: Once logged in, navigate to the upload page to add your images.
- **View Gallery**: View all images on the homepage, with pagination.
- **Share Images**: Click on an image to generate a unique URL for sharing.
- **User Profile**: Manage your uploaded images from your profile page.

## 📄 API Documentation

### Endpoints

1. **User Authentication**

   - **GET** `/signup`: Displays the signup page through Auth0.
   - **GET** `/login`: Displays the login page through Auth0.
   - **GET** `/profile`: Displays the user profile page (Authenticated users only).

2. **Image Management**

   - **GET** `/upload`: Displays the image upload page (Authenticated users only).
     - Middleware: `ensureUserExists`.
   - **POST** `/upload`: Handles image uploads (Authenticated users only).
     - Middleware: `ensureUserExists`, `multer` for image uploads.
   - **GET** `/:shortUrl`: Displays the image details using the short URL.
   - **POST** `/:id/comments`: Adds a comment to an image (Authenticated users only).
     - Middleware: `ensureUserExists`.
   - **DELETE** `/:id`: Deletes an image uploaded by the user (Authenticated users only).
     - Middleware: `ensureUserExists`.
   - **GET** `/:id/edit`: Displays the image update form (Authenticated users only).
     - Middleware: `ensureUserExists`.
   - **PUT** `/:id`: Updates the image metadata (Authenticated users only).
     - Middleware: `ensureUserExists`.

3. **Home and Gallery**
   - **GET** `/`: Displays the homepage with a gallery of images.

### Models (TypeORM Entities)

1. **User**

   - **Fields**:
     - `id`: UUID of the user (primary key).
     - `email`: Email of the user.
     - `name`: User's name (optional, provided by Auth0).
     - `images`: One-to-many relationship with the `Image` entity.

2. **Image**
   - **Fields**:
     - `id`: UUID of the image (primary key).
     - `url`: S3 URL of the uploaded image.
     - `metadata`: JSON object with details like size, format, etc.
     - `userId`: Foreign key relationship to the `User` entity.
     - `createdAt`: Timestamp of image upload.

### Example API Requests

- **Upload an Image** (Authenticated):

  ```bash
  curl -X POST http://localhost:3000/upload     -H "Authorization: Bearer <Auth0_JWT>"     -F "image=@/path/to/image.jpg"
  ```

- **Get Image Details**:

  ```bash
  curl http://localhost:3000/{shortUrl}
  ```

- **Add a Comment to an Image** (Authenticated):

  ```bash
  curl -X POST http://localhost:3000/{imageId}/comments     -H "Authorization: Bearer <Auth0_JWT>"     -d '{"comment": "Great photo!"}'
  ```

- **Delete an Image** (Authenticated):

  ```bash
  curl -X DELETE http://localhost:3000/{imageId}     -H "Authorization: Bearer <Auth0_JWT>"
  ```

- **Update Image Metadata** (Authenticated):

  ```bash
  curl -X PUT http://localhost:3000/{imageId}     -H "Authorization: Bearer <Auth0_JWT>"     -d '{"title": "New Title"}'
  ```

## 🌐 AWS Deployment

To deploy the application on AWS, follow these steps:

1. **Dockerize the Application**: The `Dockerfile` and `docker-compose.yml` are pre-configured for containerization.
2. **ECS Setup**:
   - Use the `terraform/` directory to set up AWS ECS for container orchestration.
   - Run Terraform commands to provision the infrastructure:
     ```bash
     cd terraform
     terraform init
     terraform apply
     ```
3. **S3 Setup**:
   - AWS S3 is used to store images. Ensure your bucket is configured for public access with appropriate permissions.
4. **CloudFront Setup**:
   - Set up CloudFront to cache and deliver images from S3 for faster access.

### Continuous Deployment (Optional)

You can set up a CI/CD pipeline to automatically deploy updates to ECS using GitHub Actions, AWS CodePipeline, or other tools.
