React-Final-Project
===================

Project Documentation
---------------------

### Table of Contents

1.  Client Side
    *   Description
    *   Setup
    *   Implementations
2.  Admin Side
    *   Description
    *   Setup
    *   Implementations
3.  Server Side
    *   Description
    *   Setup
    *   Implementations

Introduction
------------

This full‑stack, scalable project is an e‑commerce platform that offers a diverse range of clothing for all demographics – women, men, and children. The platform delivers a personalized user experience and a modern, interactive interface. To enhance usability, users can select their preferred language – English or Bulgarian.

### Client Side 

Users can browse product categories, view detailed information in the "About" section, log in to their accounts (via standard login or Google OAuth), and manage their shopping carts. Once authenticated, users unlock additional features for a more personalized shopping experience. They can like or dislike products based on their taste and comment on each product. Furthermore, users can save items for later and add them to the cart when ready. A mock payment system is integrated, allowing users to purchase the items in their cart and then view their completed orders (order history).

Robust filtering and sorting logic ensures that only desired products are displayed. Users can also use the search bar to find items using English or Bulgarian prompts – autocomplete guides them toward the relevant results.

### Admin Side

The website includes an admin panel accessible exclusively to administrators. After logging in, admins can create, update, delete, and preview products, promocodes, orders, and other admin accounts (superadmins, admins, and operators). These different admin roles provide role‑based access control (RBAC) for security.

The admin side also features an intelligent analytics/statistics page that displays key shop metrics: total number of products (available/unavailable), total registered users, total orders, generated income, most liked/commented products, and distribution of products by categories, subcategories, offices, etc. 

### Server Side

The server side handles all API requests and manages database operations. The platform gracefully handles both client‑side and server‑side errors, informing users and guiding them through any issues via pop‑up notifications and error messages.

### Conclusion

This full‑stack platform manages the entire process of running a clothing e‑commerce store.

Technologies Used
-----------------

*   **Frontend:** React.js, JavaScript, HTML5, CSS3
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Authentication:** JWT (JSON Web Token), Google OAuth, react-google-recaptcha, bcrypt
*   **Communication:** CORS, axios
*   **Routing:** react-router-dom
*   **Image Storage:** Multer 
*   **Translations:** i18next, react-i18next
*   **Others:** Dotenv, Google Maps API, Font Awesome, React Icons, UI libs

Client Side Documentation
-------------------------

#### Description

The client-side is the primary interface for customers, designed to facilitate an engaging shopping experience. Both logged-in and guest users can browse products as well as sort them, but only authenticated users can access detailed product information, like/dislike or leave a comment, save the product for later and manage their shopping cart.

#### Setup

The app is built using the React framework.

#### Implementations

The client-side incorporates the following features:

* User authentication – Sign up and login (standard email/password or Google OAuth).
* reCAPTCHA – "Not a robot" verification during registration/login.
* Product browsing – View categories, detailed product info, and "About" section.
* Shopping cart management – Add, remove, and update quantities.
* Personalized features (authenticated users only):
1. Like / dislike products
2. Comment on products
3. Save items for later, then move them to cart
* Mock payment – Purchase items and view order history.
* Filtering & sorting – Robust logic to display only desired products.
* Search bar – Use English or Bulgarian prompts with autocomplete guidance.
* REST API requests – Dynamic data interaction between client and server.
* Context API – Efficient management of shared resources (user, cart, theme, etc.).
* Routing – Seamless navigation between pages without full reloads.
* Error handling & validation – Comprehensive client‑side validation and clear error messages.

Admin Side Documentation
------------------------

#### Description

The admin-side is the endpoint for managing product, promocodes, admins and order details. The Admin Panel allows authenticated administrators to create new products, update existing product details, remove products, and preview all products in stock and analyze client trends and shop stats using the statistics page.

#### Setup

The app is built using the React framework.

#### Implementations

The admin-side incorporates the following features:

* Admin panel – Exclusively accessible to administrators.
* Full CRUD operations – Create, update, delete, and preview:
1. Products
2. Promocodes
3. Orders
4. Other admin accounts (superadmins, admins, operators)
* Role‑based access control (RBAC) – Different admin types for security.
* Analytics / statistics page – Displays key shop metrics:
1. Total products (available / unavailable)
2. Total registered users
3. Total orders
4. Generated income
5. Most liked / most commented products
6. Distribution of products by categories, subcategories, offices, etc.

Server Side Documentation
-------------------------

#### Description

The server side of the project is built using Node.js and more precisely the Express.js framework and is responsible for database connectivity with MongoDB. The Multer module enables image uploads for product management. Server-side logic includes client and admin authentication using JWT.

#### Setup

The server is built using Node.js and Express.js

#### Implementations

The admin-side incorporates the following features:

* Handles all REST API requests.
* Manages database operations.
* Graceful error handling for both client‑side and server‑side errors.
* Users are informed via pop‑up notifications and error messages.

Others
------

### Authentication & Security

#### Description

The application implements multiple security mechanisms to ensure secure user interaction and data protection.

#### Implementations

Implemented security features include:

* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Google OAuth verification
* Environment variable protection
* reCAPTCHA validation
* Backend validation middleware

### Database Management

* MongoDB integration
* Mongoose schemas and models
* Data validation
* Structured collections

### File Upload System

* Image upload handling with Multer
* Product image storage
* Multipart form processing

Setup Project locally
---------------------

### Client/Admin Side Setup

1.  Clone the git repository
2.  Navigate to the client/admin directory
3.  Run `npm install` or `npm i` to install node\_modules dependencies
4.  Run `npm run dev` to launch the cleint/admin side
5.  Go to http://localhost:5173/ or http://localhost:5174/ to preview app

### Server Side Setup

1.  Clone the repository
2.  Navigate to the server directory
3.  Run `npm install` or `npm i` to install node\_modules dependencies
4.  Set up environment variables for database connection and JWT secret
5.  Run `node server.js` to launch the server
6.  If everything is setup properly you should see **_Server running on port 3030_** and should be able to go to http://localhost:3030/

Test Project
------------

## Client login

There are some test users created in the database for login test. 

1.  Email: `valery@gmail.com`, Pass: `ValerchoEPich!1`
2.  Email: `ivan@abv.bg`, Pass: `Ivanski_M@05`
3.  Email: `ivaylo70@yahoo.com`, Pass: `IvchoDoks_$1$`


## Client sign up

You can sign up with any account of you choice by providing username, email and password. 

*  After successful user authentication via login or sign up you should be able to access your personalized shopping cart,allowing you to add or remove products and view additional product details information.

## Admin login

There are some admins created in the database for login test.

1.  Email: `superadmin@mail.com`, Pass: `?SuperAdmin123`
2.  Email: `valeryraikov1@gmail.com`, Pass: `ValeriAdmin%22`

You can login only with one of these credentials and sign up is not allowed Superadmin can create other admins itself. 
*  After successful login, you should be able to perform CRUD operations on the products.


# Future Improvements

Potential future upgrades include:

- Product reviews and ratings (instead of likes/dislikes)
- AI-based recommendations
- Order tracking system
- Email notifications
- Dark mode
- Redis caching
- Docker containerization
- CI/CD pipeline integration

# Author

Developed by Valery Raikov as a full-stack e-commerce graduation project.

Note
----

I recommend you to preview the project on `1440px` resolution dimensions or more