# The Food Network

The Food Network is a full-stack MERN (MongoDB, Express, React, Node.js) web application made to centralize food availability information for consumers, with a special focus on supporting food banks and pantries. It ensures that users are informed in real-time about newly available food stock, helping local food services like the University of Arizona’s Campus Pantry and Tucson-area food banks communicate more effectively with the communities they serve.

## **Motivation**

Food banks often struggle to update consumers on what’s available and updates are scattered across different social media accounts and websites. This application provides a central hub where consumers can:

- Discover food services nearby
- Subscribe to food banks they rely on
- Receive real-time updates when food is added or delivered

At the same time, food bank administrators can easily manage their orders and notify subscribers instantly without redundant communication steps.

## **Features**

Authentication & Role-Based Access (RBAC)
- Register/Login with email, password, and user role (`Consumer` or `Food Bank`)
- JWT stored in local storage for persistent sessions
- AuthContext reinitializes login status on refresh
- Passwords are salted & hashed
- Protected backend API with token-based access

Food Bank User Capabilities
- View active and completed orders
- Create, update, or delete orders
- Automatically notify subscribed consumers via email on new or updated orders
- Update profile information

Consumer User Capabilities
- Search for food banks by name, item(s), or location
- Subscribe/unsubscribe to banks
- View a map of food sources with transit info
- View and filter all orders from subscribed banks

## **Acknowledgments**
This project was created as a collaborative team effort in December 2024 as part of coursework for CSC 436 at the University of Arizona.



