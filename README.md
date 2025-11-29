## Weather App

A web application built with Django and Next.js to display and save weather history.

## Features

### Guest User
- Display weather for a selected location.
- Display weather for the user's current location (with proper location access request).

### Logged-in User
- Save favorite locations.
- Save up to 'x' weather forecasts (where 'x' is determined by the administrator).

### Admin User
- View and search saved user forecasts.
- See statistics on locations searched by both logged-in and guest users.

## Technical Details
- Weather data will be fetched from an external service (e.g., OpenWeatherMap).
- Data will be stored in a database.
- The entire application will be based on Docker Compose for easy setup and local installation with a single command.


```
docker-compose up
```


.env
```.env
# PostgreSQL Database Configuration
POSTGRES_DB=weather_app_db
POSTGRES_USER=weather_app_user
POSTGRES_PASSWORD=your_strong_password_here

# Django Configuration
DJANGO_SECRET_KEY=your_django_secret_key_here
DEBUG=1
```

Backend Swagger URL
http://127.0.0.1:8000/api/v1/swagger/



<img width="808" height="904" alt="image" src="https://github.com/user-attachments/assets/3ac52ea7-6977-479a-9f6f-14b15df05665" />

<img width="745" height="912" alt="image" src="https://github.com/user-attachments/assets/e9458871-8a67-4789-beac-fe6bde555942" />

<img width="755" height="576" alt="image" src="https://github.com/user-attachments/assets/bbb60982-3e68-4473-9b09-0c8e5f87dcc9" />


<img width="451" height="354" alt="image" src="https://github.com/user-attachments/assets/872b454b-3446-4911-a06a-c685cc8f690f" />

<img width="811" height="317" alt="image" src="https://github.com/user-attachments/assets/b66e45aa-5339-46a6-b32f-0b34543282de" />


<img width="857" height="415" alt="image" src="https://github.com/user-attachments/assets/c6de6e51-ae9c-4a15-92ea-02b87cf51100" />


