# Travel-Recommendation-System
The project was developed as part of our minor project for the 6th semester, and it aims to provide users with personalized travel recommendations for exploring Nepal.

### To run this project 

1. Clone this project using 

        git clone https://github.com/sumitaryal/Travel-Recommendation-System.git

2. Navigate to the project directory 

3. To run the backend server
   
   1. Navigate to the bankend folder
   2. Create a virtual environment for the project using "virtualenv"
   3. Activate the virtual environment
   4. Install the required dependencies 

            pip install -r requirements.txt
   5. Start the backend server 

            python manage.py runserver
4. To run the frontend 
   1. Navigate to the frontend folder
   2. Install necessary packages and dependencies 

            npm ci
   3. Make necessary changes to the build script in package.json file according to your operating system
      1. Windows

                "build": "rmdir /s /q ..\backend\build & react-scripts build & xcopy /e build ..\backend\build"
      2. UNIX

                "build": "rm -rf ../backend/build && react-scripts build && cp -r build ../backend/build"
   4. Build the app for production server

            npm run build
5. To run the CustomAPI 
   1. Navigate to the customAPI folder
   2. Run the command

            python app.py
6. Now that all the necessary steps are completed. Go to http://localhost:8000/ to view the project
