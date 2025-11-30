## Weather App

A web application built with Django and Next.js to display and save weather history.

## Features

### Guest User

- Display weather for a selected location.
- Display weather for the user's current location (with proper location access request).

### Logged-in User

- Save and delete favorite locations.

### Admin User

- View and search saved user forecasts.
- See statistics on locations searched by both logged-in and guest users.

## Technical Details

- Weather data will be fetched from an external service OpenWeatherMap.
- Data will be cached in a database.

### Technology

### Backend

- Django
- PostgresSQL
- Redis

### Frontend

- NextJS with TypeScript

## Deployment

This project uses Docker Compose to orchestrate multiple services: PostgreSQL database, Redis cache, Django backend, and
Next.js frontend.

### Prerequisites

- Docker and dokcer compose installed on your system
- OpenWeatherMap API key One Call API 3.0  (get one at [https://openweathermap.org/api](https://openweathermap.org/api))

### Step 1: Create Environment File

Create a `.env` file in the project root directory with the following environment variables:

```.env
# PostgreSQL Database Configuration
POSTGRES_DB=weather_app
POSTGRES_USER=weather_app_user
POSTGRES_PASSWORD=your_strong_password_here

# Django Configuration
DJANGO_SECRET_KEY=your_django_secret_key_here
DEBUG=1

# OpenWeatherMap API Keys
WEATHER_KEY_ONE_CALL=your_openweathermap_onecall_api_key_here
```

**Important Notes:**

- Replace `your_django_secret_key_here` with a Django secret key (you can generate one using:
  `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
- Replace `your_openweathermap_onecall_api_key_here` with your OpenWeatherMap One Call API 3.0 key for weather data
- Set `DEBUG=0` for production deployment

### Step 2: Run Docker Compose

Navigate to the project root directory and run:

```bash
docker-compose up
```

This command will:

1. Build the Docker images for backend and frontend
2. Start PostgreSQL database container
3. Start Redis cache container
4. Start Django backend container (runs migrations automatically)
5. Start Next.js frontend container

### Step 3: Access the Application

Once all containers are running, you can access:

- **Frontend Application**: http://127.0.0.1:80
- **Backend API Swagger Documentation**: http://127.0.0.1:5050/api/v1/swagger/
- **Django Admin Panel**: http://127.0.0.1:5050/admin

### Stopping the Application

```bash
docker-compose down
```

### Troubleshooting

- Ensure ports 80 and 5050 are not already in use

## Main App
<img width="842" height="499" alt="image" src="https://github.com/user-attachments/assets/2435824b-eeae-4cba-aab3-b8cd71487723" />


<img width="808" height="904" alt="image" src="https://github.com/user-attachments/assets/3ac52ea7-6977-479a-9f6f-14b15df05665" />

<img width="745" height="912" alt="image" src="https://github.com/user-attachments/assets/e9458871-8a67-4789-beac-fe6bde555942" />

<img width="755" height="576" alt="image" src="https://github.com/user-attachments/assets/bbb60982-3e68-4473-9b09-0c8e5f87dcc9" />

## Log in

<img width="451" height="354" alt="image" src="https://github.com/user-attachments/assets/872b454b-3446-4911-a06a-c685cc8f690f" />

## Favorite locations

<img width="811" height="317" alt="image" src="https://github.com/user-attachments/assets/b66e45aa-5339-46a6-b32f-0b34543282de" />


<img width="857" height="415" alt="image" src="https://github.com/user-attachments/assets/c6de6e51-ae9c-4a15-92ea-02b87cf51100" />

<img width="405" height="399" alt="image" src="https://github.com/user-attachments/assets/9e22fb8f-ac18-4032-8d6c-08d6ae0de3b9" />

