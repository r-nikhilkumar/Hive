# Hive - Connect with the World

Hive is a scalable, feature-rich social media platform designed to connect users globally. With advanced features like posts, reels, chat, and future video calling capabilities, Hive is built to handle rapid user growth with seamless functionality.

---

#### For an in-depth explanation of the backend architecture, including system design concepts focused on scalability and enhancements at an industry level, [please refer to this document](https://docs.google.com/document/d/1bbuZtO_GYk09vSegyYA2ed-gD-WyXbhfCkMWCGpG6TU/edit?usp=sharing).

## Features

### **Frontend**
- Built using **React.js** for modular and reusable components.
- **Redux** for state management, ensuring predictable and efficient data flow.
- Responsive and modern design with **TailwindCSS**, optimized for all devices.
- Technologies used: **TypeScript**, **React Router**, **Framer Motion** for animations.

### **Backend**
- **Microservices architecture** for scalability and modularity:
  - **User Service**: Handles authentication, authorization, and profile management.
  - **Chat Service**: Real-time messaging with **WebSocket** and **Redis** caching.
  - **Post Service**: Manages posts, media uploads, hashtags, and mentions.
  - **Gateway Service**: Routes requests to appropriate microservices.
- **GraphQL** for efficient interconnection between microservices, enabling seamless data aggregation.
- **REST APIs** for external client communication, ensuring simplicity and compatibility.
- **Redis** for caching frequently accessed data, ensuring low-latency responses.
- **MongoDB** for data storage, with sharding and replication for scalability.
- **Docker** for containerization and **Docker Compose** for local orchestration.
- Future enhancements:
  - **WebRTC** for low-latency video calling.
  - **Kubernetes** for production-grade orchestration.

---

## Installation

### Prerequisites
- **Node.js** (v18+)
- **Docker** (latest)
- **MongoDB** and **Redis** (if running locally without Docker)

### Dependencies
Below are the key dependencies required for running the project:

#### **Frontend Dependencies**
- `react`: For building UI components.
- `redux`: For managing application state.
- `tailwindcss`: For modern and responsive UI styling.
- `react-router-dom`: For routing and navigation.
- `framer-motion`: For animations.
- **Install all frontend dependencies**:
  ```bash
  cd frontend
  npm install
  ```

#### **Backend Dependencies**
- `express`: Backend framework for REST APIs.
- `graphql`: For inter-microservice communication.
- `mongoose`: MongoDB ORM for data modeling.
- `redis`: For caching real-time data.
- `jsonwebtoken`: For handling user authentication.
- `socket.io`: For real-time chat features.
- **Install all backend dependencies**:
  ```bash
  cd backend
  npm install
  ```

---

### Steps to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hive.git
   cd hive
   ```

2. Install dependencies for **frontend** and **backend**:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory of the **backend** and configure the following:
     ```env
     PORT=3000
     USER_PORT=3001
     POST_PORT=3002
     CHAT_PORT=3003
     USER_MONGO_URI=mongodb://localhost:27017/hive-user
     CHAT_MONGO_URI=mongodb://localhost:27017/hive-chat
     POST_MONGO_URI=mongodb://localhost:27017/hive-post
     REDIS_URL=redis://localhost:6379
     JWT_SECRET_KEY="hiveisheretoconnect"
     JWT_REFRESH_SECRET="hiveisheretoconnectAgainAndAgain"
     REDIS_USERNAME=<put_here_yours_one>
     REDIS_PASSWORD=<put_here_yours_one>
     REDIS_HOST=<put_here_yours_one>
     REDIS_PORT=11857
     CLOUDINARY_CLOUD_NAME=<put_here_yours_one>
     CLOUDINARY_API_KEY=<put_here_yours_one>
     CLOUDINARY_API_SECRET=<put_here_yours_one>
     ```

4. Start the services using Docker Compose:
   I have created image already, just have to up the contrainers
   ```bash
   docker-compose up
   ```

6. For local development without Docker:
   - Start MongoDB and Redis manually.
   - Start the backend services:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend:
     ```bash
     cd frontend
     npm run dev
     ```

---

## Deployment

### With Docker
1. Build the images:
   ```bash
   docker-compose build
   ```

2. Deploy the stack:
   ```bash
   docker-compose up -d
   ```

### Future Plans
- **Kubernetes** for production:
  - Use Helm charts for deployment.
  - Configure Horizontal Pod Autoscaling (HPA) based on traffic and resource usage.
- **CDN Integration** for faster delivery of static assets (e.g., AWS S3).

---

## Technologies Used

### **Frontend**
- React.js
- Redux
- TailwindCSS
- TypeScript

### **Backend**
- Node.js
- REST APIs
- GraphQL (for microservices interconnection)
- Redis
- MongoDB
- Docker & Docker Compose

### **Other Tools**
- WebSocket (for real-time communication)
- RabbitMQ (message queues)

---

## Contributing

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).
