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