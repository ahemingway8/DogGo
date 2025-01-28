# DOGGO!
DogGo is an application that helps users find pet-friendly locations and events nearby. The app features secure enpoints for users to explore dog-friendly spots, create events, and search for locations using external APIs.

## Application Authors
- April Hemingway
- Zachary Ornelas
- Hayden Schreiber
- Ciera Villalpando

## Design
### Wireframe
![Wireframe](ghi/public/DOGGO.png)

### Home Page
![Home Page](ghi/public/Screenshot%202025-01-27%20at%205.17.21 PM.png)

### Places Page
![Places Page](ghi/public/Screenshot%202025-01-27%20at%205.33.07 PM.png)

### Events Page
![Events Page](ghi/public/Screenshot%202025-01-27%20at%205.35.52 PM.png)

## Getting started

- Clone the repository:
- git clone https://gitlab.com/dog-go1/module3-project-gamma.git
- cd your-repo-name
- Create a virtual environment and activate it:
- python -m venv .venv
- source .venv/bin/activate #for linux/macOs
- .\.venv\Scripts\Activate.ps1 #for windows
- Install dependencies:
- pip install -r requirements.txt
- Set up environment variables in a .env file:
- GEOAPIFY_API_KEY=your_geoapify_api_key
- Run Docker Desktop
- Run the application:
- docker compose build
- docker compose up
- http://localhost:5173/ #brings up the application
- http://localhost:8000/ #brings up fast API endpoint testing


## API EndPoints
### Public Routes
- GET / -HomePage with links to find places and Events.
- GET /redirect/{page_name} -Redirects users to the specified page (places or events).
### Protected Routes
- GET /places -fetches dog-friendly locations (requires JWT).
- POST /api/events -Creates a new event (requires JWT).
- GET /api/events -Lists all events.
- PUT /api/events/{event_id} -Updates an event (requires JWT).
- DELETE /api/events/{event_id} - Deletes an event (requires JWT).

- GET /api/locations - Search pet-friendly locations using Geoapify.
- GET /api/geocode - Converts an address to latitude and longitude.


## Deliverables

-   [ ] Wire-frame diagrams
-   [ ] API documentation
-   [ ] Project is deployed to Caprover (BE, DB) & GitLab-pages (FE)
-   [ ] GitLab issue board is setup and in use (or project management tool of choice)
-   [ ] Journals



### Setup GitLab repo/project

-   make sure this project is in a group. If it isn't, stop
    now and move it to a GitLab group
-   remove the fork relationship: In GitLab go to:

    Settings -> General -> Advanced -> Remove fork relationship

-   add these GitLab CI/CD variables:
    -   PUBLIC_URL : this is your gitlab pages URL
    -   VITE_APP_API_HOST: enter "blank" for now

#### Your GitLab pages URL

You can't find this in GitLab until after you've done a deploy
but you can figure it out yourself from your GitLab project URL.

If this is your project URL

https://gitlab.com/GROUP_NAME/PROJECT_NAME

then your GitLab pages URL will be

https://GROUP_NAME.gitlab.io/PROJECT_NAME
