# Movie Web App with Angular
This repository contains a movie web application developed using Angular. The application fetches data from the **[TMDb](https://www.themoviedb.org/)** database to offer features such as movie listing, searching, and viewing details. It can also be used as an example Angular project for developers.

## Features
- **Movie Listing:** Popular movies and TV shows can be listed.
- **Search:** You can search by movie or TV show titles.
- **Movie Details:** Details of the selected movie or TV show can be viewed.
- **Visual / Poster:** Movie posters and images can be displayed from the TMDb database.
- **Responsive Design:** The layout is responsive and works on mobile, tablet, and desktop devices.

## Live Demo  
The application is live and accessible at: **[Movie Web App - Live Demo](https://movie-web-app-angular.netlify.app/home)**

## Requirements
- [Visual Studio Code](https://code.visualstudio.com/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation
- Clone the repository:
```bash
git clone https://github.com/uyarmelik/movie-web-app-angular.git
cd movie-web-app-angular
```

- Install the required dependencies:
```bash
npm install
# or
yarn install
```

- Configure the environment variables: The TMDB API key can be set in the `src/environments/environment.ts` or `src/environments/environment.prod.ts` file for local development. For production deployment on Netlify, store the API key securely as an environment variable in the Netlify dashboard under `Site Settings > Environment Variables`.

- Start the development server:

```bash
ng serve --port 4200 --open
```

- Then, open your browser and navigate to http://localhost:4200/ to view the application.
