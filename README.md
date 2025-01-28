# DOGGO!
DogGo is an application that helps users find pet-friendly locations and events nearby. The app features secure enpoints for users to explore dog-friendly spots, create events, and search for locations using external APIs.

## Getting started

Clone the repository:
git clone https://gitlab.com/dog-go1/module3-project-gamma.git
cd your-repo-name
Create a virtual environment and activate it:
python -m venv env
souce env/bin/activate #for linux/macOs
env\Scripts\activate #for windows
Install dependencies:
pip install -r requirements.txt
Set up environment variables in a .env file:
GEOAPIFY_API_KEY=your_geoapify_api_key
Run the application:

## API EndPoints
- GET / -HomePage with links to find places and Events.
- GET /redirect/{page_name} -Redirects users to the specified page (places or events).

- GET /places -fetches dog-friendly locations (requires JWT).
- POST /api/events -Creates a new event (requires JWT).
- GET /api/events -Lists all events.
- PUT /api/events/{event_id} -Updates an event (requires JWT).
- DELETE /api/events/{event_id} - Deletes an event (requires JWT).

- GET /api/locations - Search pet-friendly locations using Geoapify.
- GET /api/geocode - Converts an address to latitude and longitude.

## ScreenShots
### Home Page
![Home Page]()

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
