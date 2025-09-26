# 📦 Parcel Delivery API
A **secure, modular, and role-based backend API** for managing a parcel delivery system. Built using **Express.js**, **Mongoose**, and **TypeScript**, this project supports different user roles with controlled access to parcel operations, including tracking, creation, and status updates.

---

## 🎯 Project Overview

This API allows:
- ✅ **Senders** to create, cancel, and track their parcels
- ✅ **Receivers** to view incoming parcels and confirm delivery
- ✅ **Admins** to manage users and parcel statuses
- ✅ **Embedded status tracking** 
- ✅ **JWT-based authentication** and **role-based authorization**

---

## 🛠️ Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Auth**: JWT, Bcrypt
- **Testing**: Postman
- **Tooling**: ts-node-dev, ESLint

---



## 🔐 entication & orization

- **JWT-based** entication system
- **Password hashing** using bcrypt
- Three user roles:
  - `admin`
  - `sender`
  - `receiver`
- **Role-based access control middleware**

---

## 🧱 Parcel & Status Schema

### Parcel Fields:
- `trackingId` (`TRK-YYYYMMDD-xxxxxx`)
- `senderId`, `receiverId`
- `type`, `weight`, `cost`
- `Address`, `status`, `description`
- `statusLogs[]`: Array of subdocuments

### StatusLog Subdocument:
- `status` (e.g., Requested, Dispatched, Delivered)
- `location`
- `note`
- `updatedBy`
- `timestamp`

---

## 📦 Parcel Flow & Validations

- 📌 Only **senders** can create parcels
- 🚫 Parcels can be **canceled** only before dispatch
- ✅ **Receivers** can confirm delivery
- 🔐 **Admins** can update status of users & parcels
- 🔁 **Status log** auto-updates with every status change

---

## 📊 API Endpoints

### 👤 User & Tracking Endpoints

| Method | Endpoint                          | Description                            |
|--------|-----------------------------------|----------------------------------------|
| POST   | `/user/register`                  | Register a new user (sender or receiver) |
| GET    | `/user/track-parcel/:trackingId`       | Publicly track a parcel by its tracking ID |


### Auth Routes
| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| POST   | `/auth/login`      | Login and receive JWT  |
| POST   | `/auth/logout`      | Logout and remove JWT  |
| POST   | `/auth/reset-password`  | change own password |


### Sender Routes
| Method | Endpoint                 | Description                     |
|--------|--------------------------|---------------------------------|
| POST   | `/sender/create-parcel`  | Create a new parcel             |
| POST   | `/sender/cancel/:id`     | Cancel parcel before dispatch   |


### Receiver Routes
| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| GET    | `/parcels/incoming`     | List incoming parcels           |
| PATCH  | `/parcels/receive/:id`  | Confirm parcel delivery         |
| GET    | `/parcels/history`      | Get delivery history            |


### 📦 Parcel Routes (Accessible by Sender and Receiver)

The following endpoints allow senders and receivers to view and filter their parcels.

| Method | Endpoint                              | Description                                         |
|--------|---------------------------------------|-----------------------------------------------------|
| GET    | `/parcel/get-parcels`                 | Retrieve all parcels related to the user            |
| GET    | `/parcel/get-parcels/:id`             | Get details of a specific parcel by its ID          |
| GET    | `/parcel/get-parcels?searchTerm=`     | Search parcels by Searchable Fields                 |
| GET    | `/parcel/get-parcels?sort=`           | Sort parcels by fields (e.g., description, type)    |
| GET    | `/parcel/get-parcels?fields=`         | Select specific fields to display in the response   |
| GET    | `/parcel/get-parcels?page=`           | Paginate results by specifying the page number      |
| GET    | `/parcel/get-parcels?limit=`          | Limit the number of results per page                |


### 🔍 Searchable Fields

The following fields can be used with the `searchTerm` query parameter in `/parcel/get-parcels`:

- `description`
- `parcelType`
- `pickupAddress`
- `deliveryAddress`

**Example:**
```http
GET https://bondhucurier.vercel.app/api/v1/parcel/get-parcels?page=1&limit=2
GET https://bondhucurier.vercel.app/api/v1/parcel/get-parcels?fields=description
GET https://bondhucurier.vercel.app/api/v1/parcel/get-parcels?sort=pickupAddress
GET https://bondhucurier.vercel.app/api/v1/parcel/get-parcels?searchTerm=box
```


### Admin Routes
| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| GET    | `/admin/all-users`       | View all users                 |
| PATCH  | `/admin/users/:id`       | Update a user                  |
| GET    | `/admin/parcels`         | View all parcels               |
| PATCH  | `/admin/parcels/:id`     | Update parcel status           |
| GET    | `/parcel/get-parcels?searchTerm=`     | Search parcels by Searchable Fields                 |
| GET    | `/parcel/get-parcels?sort=`           | Sort parcels by fields (e.g., description, type)    |
| GET    | `/parcel/get-parcels?fields=`         | Select specific fields to display in the response   |
| GET    | `/parcel/get-parcels?page=`           | Paginate results by specifying the page number      |
| GET    | `/parcel/get-parcels?limit=`          | Limit the number of results per page                |
| POST    | `admin/block-user/:id`               | Block users by ID           |
| POST    | `admin/unblock-user/:id`             | Unblock users by ID         |
| POST    | `admin/approve-parcel/:id`           | Approve Parcel by ID        |
| POST    | `admin/cancel-parcel/:id`            | Cancel Parcel by ID         |
| DELETE    | `admin/delete-parcel/:id`          | Delete Parcel  by ID        |
| DELETE    | `admin/delete-user/:id`            | Delete User  by ID          |

---

## 🧪 Testing & Documentation

- ✅ **Postman** collection included
- ✅ All endpoints tested with authentication and role-based access
- ✅ Status codes follow HTTP conventions (e.g., 200, 401, 403, 404)

---

### 👥 Sender & Receiver Access

Both **Senders** and **Receivers** can access all parcels **associated with them**, including:

- Parcels **created by the sender**
- Parcels **assigned to the receiver**
- Full **status logs** and **tracking history** for their parcels
- Ability to **search, filter, sort, and paginate** their parcel list

---

## 💼 Business Logic Rules

- 🚫 Dispatched parcels can't be canceled
- ✅ Receivers can confirm delivery after parcel delivered
- 🔐 Blocked users can't login
- ⚠️ Banned senders cannot create new parcel requests

---

## 💡 Extra Features (Optional)

- 📍 Tracking system with public tracking ID 
- 📊 Fee calculation based on weight and type
- 🧑‍💼 Admin dashboard (API-ready)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run the development server
npm run dev
