import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignInForm from './pages/SignInForm';
import SignUpForm from './pages/SignUpForm';
import HomePage from './pages/HomePage';
import EventsListPage from './pages/EventsPage';
import EventForm from './pages/EventForm';
import EventsEditForm from './pages/EventUpdateForm';
import EventDetailPage from './pages/EventsDetail';
import PlacesPage from './pages/PlacesPage';
import ServicesListPage from './pages/ServicesListPage';
import CreateServiceForm from './pages/CreateServiceForm';
import AuthProvider from './components/AuthProvider';
import App from './App';
import './index.css';
import MyEventsPage from './pages/MyEventsPage';
import MyServices from './pages/MyServices';
import ServiceDetail from './pages/ServiceDetail';
import ServiceUpdateForm from './pages/ServiceUpdateForm';


const BASE_URL = import.meta.env.BASE_URL
if (!BASE_URL) {
    throw new Error('BASE_URL is not defined')
}

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            children: [
                {
                    index: true,
                    element: <HomePage />,
                },
                {
                    path: 'signup',
                    element: <SignUpForm />,
                },
                {
                    path: 'signin',
                    element: <SignInForm />,
                },
                {
                    path: 'places',
                    element: <PlacesPage />,
                },
                {
                    path: 'events',
                    element: <EventsListPage />,
                },
                {
                    path: 'events/new',
                    element: <EventForm />,
                },
                {
                    path: 'events/:id',
                    element: <EventDetailPage />,
                },
                {
                    path: 'events/edit/:id',
                    element: <EventsEditForm />,
                },
                {
                    path: '/my-events',
                    element: <MyEventsPage />,
                },
                {
                    path: '/services',
                    element: <ServicesListPage />,
                },
                {
                    path: '/services/create',
                    element: <CreateServiceForm />,
                },
                {
                    path: '/my-services',
                    element: <MyServices />,
                },
                {
                    path: 'services/:id',
                    element: <ServiceDetail />,
                },
                {
                    path: 'services/edit/:id',
                    element: <ServiceUpdateForm />,
                },
            ],
        },
    ],
    {
        basename: BASE_URL,
    }
)

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('root element was not found!')
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>
)
