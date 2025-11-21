# How to Run the Project

This project has two parts:

* **Backend** (ASP.NET Web API)
* **Frontend** (Angular)

Follow the steps below to run both.

---

### **Steps to Run**

1. Open the backend solution in **Visual Studio**.
2. Restore NuGet packages if needed.
3. Make sure the project starts on port **5000** (or update the Angular `API_BASE` variable).
4. Press **F5** or click **Run**.
5. The backend API will now run on:

   ```
   http://localhost:5000
   ```

---

## 📌 Frontend (Angular)

### **Requirements**

* Node.js LTS
* Angular CLI (`npm install -g @angular/cli`)

### **Steps to Run**

1. Open a terminal inside the Angular project folder.
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the dev server:

   ```bash
   ng serve --open
   ```
4. The app will open automatically at:

   ```
   http://localhost:4200
   ```

Make sure the backend is already running so the client can communicate with it.

---
