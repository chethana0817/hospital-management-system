# 🏥 Hospital Management System

A full-stack Hospital Management System built using Flask that provides a complete solution for appointment booking and hospital information management.

---

## 📌 Overview

This project is designed to simulate a real-world hospital website with multiple pages and functionalities, including appointment booking, admin management, and informational sections.

It features a user-friendly interface for patients and an admin panel to manage appointments efficiently.

---

## 🚀 Features

### 👨‍⚕️ Patient Features

* Book appointments with doctors
* View hospital services and doctor details
* Contact and about pages for information
* Login interface (UI ready)

### 🧑‍💼 Admin Features

* Admin dashboard to manage appointments
* View all bookings
* Delete/cancel appointments
* Prevent duplicate time-slot bookings

### 🌐 Website Pages

* Home page
* About page
* Services page
* Doctors page
* Contact page
* Login page
* Appointment booking page

---

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Python (Flask)
* **Storage:** CSV (appointments.csv)

---

## 📁 Project Structure

```
hospital-management-system/
│── app.py
│── appointments.csv
│
├── static/
│   ├── script.js
│   └── style.css
│
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── doctors.html
│   ├── contact.html
│   ├── login.html
│   ├── appointment.html
│   ├── admin.html
│   ├── 404.html
│   └── 500.html
```

---

## ⚙️ How It Works

1. User navigates through the website
2. Books an appointment via the appointment page
3. Backend checks for time-slot conflicts
4. Booking is stored in `appointments.csv`
5. Admin can view and manage bookings through the admin panel

---

## ▶️ How to Run

### 1️⃣ Install Flask

```
pip install flask
```

### 2️⃣ Run the Application

```
python app.py
```

### 3️⃣ Open in Browser

```
http://127.0.0.1:5000/
```

---

## 📊 Admin Panel

Access admin dashboard:

```
http://127.0.0.1:5000/admin
```

---

## 🎯 Key Highlights

* Multi-page hospital website
* Appointment booking system
* Admin dashboard for management
* Duplicate booking prevention
* Error handling pages (404 & 500)

---

## 💡 Future Enhancements

* 🔐 Authentication system (Admin/User login backend)
* 🗄️ Database integration (MySQL/MongoDB)
* 📅 Calendar-based scheduling
* 📊 Analytics dashboard
* 💳 Online payment system

---

## 👩‍💻 Author

**Chethana M**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
