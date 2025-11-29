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

URL
http://127.0.0.1:80

http://127.0.0.1:5050/api/v1/swagger/

http://127.0.0.1:5050/admin