# 📓 Notion Clone

#### Create and Edit Notes like in Notion

This clone tries to replicate some of the great note-taking features Notion has. If you don't know [Notion.so](https://notion.so) yet, I highly recommend to check it out!

📌 Live Demo: [notion-clone.kmuenster.com](https://notion-clone.kmuenster.com/)

📌 Medium Article: [How To Build A Text Editor Like Notion](https://medium.com/swlh/how-to-build-a-text-editor-like-notion-c510aedfdfcc)

---

<img alt="notion clone screenshot" src="./screenshot.gif" width="480">

---

## Overview and Benefits

Notion Clone is designed to provide an experience similar to Notion for creating and managing notes. Its features include:

- **Slash Commands** (Type `/` to turn the block into different content types)
- **HTML Support** (Use regular HTML tags like `<a>` in text blocks)
- **Image Support** (Upload images by using the `/image` command)
- **Drag And Drop** (Reorder blocks easily by drag and drop)
- **Guest Editing** (Anyone can create public pages and share them via link)
- **User Management** (Create an account to create private pages)
- **Scheduled Jobs** (Delete inactive pages and accounts automatically)

## Tech Stack

The frontend is built with Next.js and fully server-side rendered. On the backend, a REST API handles saving user content and user management.

#### Frontend

Next.js · React.js · SCSS/SASS

#### Backend

Express.js · MongoDB with Mongoose · Nodemailer · JWT (Cookie-based)

## Installation

1. **Clone the project**

   ```sh
    git clone https://github.com/konstantinmuenster/notion-clone.git
    cd notion-clone
   ```
   
2. **Add environment variables**

   To run this application, you need to set up some environment       variables in the backend. These variables are used to configure    various aspects of the app, including authentication, database     connections, and email sending. Create an `.env` file in the       'backend' directory and add the following variables:

   - `FRONTEND_URL`: The URL of your frontend application. In this    example, it's set to `http://localhost:3000`.

   - `DOMAIN`: The domain where your backend is hosted. This is       set to `localhost` for local development.

   - `JWT_KEY`: A secret key used for token generation and            authentication.

   - `PORT`: The port on which your backend server will run. It's     set to `8080` by default.

   - `MONGO_URI`: This is the connection string for your MongoDB      database. Replace `username` and `password` with your MongoDB      credentials, and update the                       
   'cluster.gqqwp.gcp.mongodb.net/database' part to match your    
   MongoDB configuration.

   - `MAIL_HOST`: The SMTP host for sending emails. This example      uses SendGrid's SMTP host.

   - `MAIL_PORT`: The port used for email communication. It's set     to `465` in this example.

   - `MAIL_USER`: Your API key for email sending. This depends on     the email service you're using.

   - `MAIL_SENDER`: The name and email address from which system      emails will be sent.

   - `MAIL_PASSWORD`: Your SendGrid API key, or the equivalent for    your chosen email service.

   These environment variables are essential for the proper           functioning of the application. Make sure to keep sensitive        information, such as secret keys and passwords, secure when        using them in a production environment. Code snipped to add 
   these variables can be found below:

   ```
   FRONTEND_URL="http://localhost:3000"
   DOMAIN="localhost"
   JWT_KEY="yourSecretForTokenGeneration"
   PORT=8080
   MONGO_URI="mongodb+srv://username:password@cluster.gqqwp.gcp.mongodb.net/database?retryWrites=true&w=majority"
   MAIL_HOST="smtp.sendgrid.net"
   MAIL_PORT=465
   MAIL_USER="apiKey"
   MAIL_SENDER="Your Name <your@mail.com>"
   MAIL_PASSWORD="yourSendGridApiKey"
   ```

   

3. **Install and run backend (http://localhost:8080)**

    ```sh
    cd backend
    npm install
    npm start
    ```

4. **Install and run frontend (http://localhost:3000)**
    Frontend: Create an `.env.local` file in the `frontend`            directory:

    ```
    NEXT_PUBLIC_API="http://localhost:8080" // references your         Backend API endpoint
   
    ```
    Next install & Run
   
    ```sh
    cd frontend
    npm install
    npm run dev
    ```

## Hosting

You can host the application on almost any provider that supports Node applications and custom domains. I decided to host the frontend on [vercel.com](https://vercel.com) and the backend on [heroku.com](https://heroku.com). But you can host both, frontend and backend, on the same provider if you like to.

### MongoDB Atlas

You have to create a new MongoDB cluster upfront. It will store all of your page and block data. You can create one for free on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

**Make sure**, you create the following collections:
* pages
* users

**Make sure**, you allow network access to everyone (due to Heroku).

### Backend

If you want to deploy the backend on [heroku.com](https://heroku.com), create a new app in your preferred region on heroku.com.

**Make sure**, you add all production environmental variables for the backend. You can see which variables are needed in the Installation part of this readme.

**Make sure**, you add a custom domain for your backend API. Since the application uses a Cookie-based authentication, we have to run backend and frontend on the same domain. I, for example, run the frontend on `www.notion-clone.kmuenster.com` and the backend on `api.notion-clone.kmuenster.com`.

> **Want to run scheduled jobs?** To delete inactive pages and users, I run scheduled jobs frequently. If you want this feature as well, you have to add more dynos to your application and run the job `$ node jobs/index.js` via Heroku Scheduler.

Lastly, you can deploy your app using Heroku Git. 

**Make sure**, that when you push the backend to Heroku, you make a Git subtree push since `notion-clone` is a mono-repo containing backend and frontend. So run `git subtree push --prefix backend heroku master` instead of `git push heroku master`. Thus, we only push the backend part.

### Frontend

If you want to deploy the frontend on [vercel.com](https://vercel.com), you can so easily using the Vercel CLI.

With the Vercel CLI, we don't have to make a subtree push, instead we can just switch to the frontend folder and run the `vercel` command to deploy:

```sh
cd frontend
vercel
```

This will lead you through the setup guide for your frontend application. Afterwards the app should be successfully deployed.

**Make sure**, you add the Backend API endpoint as a production environmental variable on Vercel.com.

**Make sure**, you add a custom domain for your frontend (that ideally matches the domain which you have specified in your backend environmental variables 😉)

## Contributing
We welcome contributions! If you want to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and submit a pull request.

## Versioning
We will keep updating this project, so watch out for new versions and improvements.

## Frequent Asked Questions

Frontend:
### 1. How do I customize the appearance of my notes in Notion Clone?
To customize the appearance of your notes in Notion Clone, you can make modifications to the frontend components. Here's a brief guide:
- For styling and layout changes, explore the styles defined in the `styles.module.scss` files within each component.
- To change the appearance of specific elements, you can target the corresponding HTML tags and classes in the styles.
- To implement new features or visual elements, you can extend the existing components or create new ones.

### 2. How can I add new functionality to the frontend?
To add new functionality to the frontend of Notion Clone, you can follow these steps:
- Identify the component or feature you want to modify or extend.
- Edit the corresponding JavaScript or React code in the relevant component files.
- Ensure that your changes are consistent with the project's design and functionality.
- Test your new functionality thoroughly to prevent any issues.

### 3. Are there any recommended resources for frontend development in Next.js and React?
If you're new to Next.js and React or want to enhance your skills, there are numerous resources available online:
- [Next.js Documentation](https://nextjs.org/docs): The official Next.js documentation provides in-depth guides and examples.
- [React Documentation](https://reactjs.org/docs/getting-started.html): The official React documentation is a valuable resource for learning React.
- [Next.js and React Tutorials](https://www.youtube.com/): You can find tutorials on YouTube that cover a wide range of topics related to Next.js and React.
Feel free to explore these resources to improve your frontend development skills.

### 4. Where can I find more information about a specific component or feature in the frontend?
If you have questions or need more information about a particular component or feature in the frontend, you can refer to the relevant component files in the [frontend/components](https://github.com/konstantinmuenster/notion-clone/tree/master/frontend/components) directory of our GitHub repository. Each component's code and documentation can be found there.

### 5. How do I contribute to the frontend development of Notion Clone?
If you'd like to contribute to the frontend development of Notion Clone, follow these steps:
1. Fork the [GitHub repository](https://github.com/konstantinmuenster/notion-clone).
2. Create a new branch for your feature or improvement.
3. Implement your changes in the relevant component files.
4. Submit a pull request, and our team will review your contribution.

We appreciate contributions from the community and look forward to your input!

Backend:
### 1. What is the backend of this application responsible for?
The backend handles various functions, including user authentication, page management, and image storage. It also serves as the interface between the frontend and the database.

### 2. How do I modify the backend code?
You can modify the backend code to customize the application's behavior. The backend is built using Node.js and Express.js, so you can edit the route handlers in the provided controllers or add additional functionality as needed.

### 3. What database is used for this application?
This application uses MongoDB as its database. The MONGO_URI environment variable should contain the connection details for your MongoDB database.

### 4. How do I handle image uploads in the backend?
Image uploads are handled using the Multer middleware. When a user uploads an image, it is stored in the specified image directory, and the file details are saved to the database. The image upload functionality is exposed through API endpoints.

### 5. How do I set up scheduled tasks (jobs) for maintenance purposes?
The backend includes scheduled jobs for maintaining the database. Two jobs, deleteInactiveUsers and deletePublicPages, run at specified intervals. These jobs automatically delete inactive users and public pages to keep the database clean.

### 6. What is the purpose of JWT tokens in this application?
JWT tokens are used for user authentication. When a user logs in or signs up, they receive a token. This token is then used to authenticate subsequent requests to protected routes.

## About & Contact
If you have any questions, feedback, or issues, feel free to contact us. 
Konstantin Münster – [konstantin.digital](https://konstantin.digital)

Feel free to support me at:
<a href="https://www.buymeacoffee.com/kmuenster" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## License
This project is distributed under the [MIT](http://showalicense.com/?fullname=Konstantin+M%C3%BCnster&year=2019#license-mit) license. See `LICENSE` for more information.

[https://github.com/konstantinmuenster](https://github.com/konstantinmuenster)
