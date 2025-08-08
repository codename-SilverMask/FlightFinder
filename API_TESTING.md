# Flight Search App - API Testing

This document provides information on testing the API endpoints.

## Testing the API Endpoints

You can test the API endpoints using the following URLs:

### 1. Location Search

Test airport/city suggestions:

```
GET /api/locations?keyword=new
GET /api/locations?keyword=london
GET /api/locations?keyword=paris
```

### 2. Flight Search

Test flight search (requires valid IATA codes):

```
GET /api/flights/search?originLocationCode=NYC&destinationLocationCode=LAX&departureDate=2025-08-15&adults=1
GET /api/flights/search?originLocationCode=LHR&destinationLocationCode=CDG&departureDate=2025-08-15&returnDate=2025-08-20&adults=2
```

## Expected Response Format

### Location Search Response:

```json
{
  "data": [
    {
      "id": "ALHR",
      "name": "London Heathrow Airport",
      "iataCode": "LHR",
      "address": {
        "cityName": "London",
        "countryName": "United Kingdom"
      }
    }
  ]
}
```

### Flight Search Response:

```json
{
  "data": [
    {
      "id": "1",
      "oneWay": false,
      "price": {
        "currency": "EUR",
        "total": "150.00"
      },
      "itineraries": [...],
      "validatingAirlineCodes": ["BA"]
    }
  ]
}
```

## Notes

- The application uses the Amadeus Test API environment
- Some searches may return empty results depending on availability
- API responses are cached for better performance
- All dates should be in YYYY-MM-DD format
