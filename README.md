<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />

<div align="center">
  <a href="https://github.com/griffinpj/plex-picks-ssr">
    <img src="https://github.com/user-attachments/assets/e8f211b2-89ef-4664-920b-d6ea9fa59c5f" alt="Logo" width="200">
  </a>

  <h3 align="center">Plex Picks</h3>

  <p align="center">
    Pick and choose a movie to watch as a group!
    <br />
    <a href="https://github.com/griffinpj/plex-picks-ssr"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://plexpicks.griff.la">View Demo</a>
    ·
    <a href="https://github.com/griffinpj/plex-picks-ssr/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/griffinpj/plex-picks-ssr/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<p align="center">
  <img src="https://github.com/user-attachments/assets/7babd2f8-9977-4877-806c-27d61a3018db" with="300" />
</p>

Helping you and your friends finally decide on what movie to watch.

Plex Picks helps you choose what movie to watch by collecting votes on a group of 20 randomly selected movies.

The movie with the most votes among participants will be *picked*! In case of multiple movies with the same votes, Plex Picks
will choose the newest movie or the longest movie if release years are the same.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [Deno](http://deno.com)
- [PostgreSQL](https://www.postgresql.org/)
- [Oak](https://deno.land/x/oak@v17.1.3)
- [Web Sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps after cloning the project.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* Install Deno *[docs](https://docs.deno.com/runtime/)*
  ```sh
  curl -fsSL https://deno.land/install.sh | sh
  ```
* Setup new PostgreSQL user and database for Plex Picks
  
  ```sh
  # Login to postgres console
  psql -U postgres
  ```
  
  ```sql
    -- Create the new user in Postgres
  CREATE USER newuser WITH PASSWORD 'password';
  
  -- Create a new database
  CREATE DATABASE newdatabase; 
  
  -- Grant all privileges to the new user for the database 
  GRANT ALL PRIVILEGES ON DATABASE newdatabase TO newuser;
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   
   ```sh
   git clone https://github.com/griffinpj/plex-picks-ssr.git
   ```
3. Install Deno packages
   
   ```sh
   deno install
   ```
4. Update .env variables
   
   ```sh
   # .env
   PLEX_HOST = 
   PLEX_CLIENT = 
   PLEX_PRODUCT = Plex Picks
   PLEX_FORWARD_URL = http://localhost:8080/
   DB_HOST = 
   DB_PORT = 
   DB_NAME = 
   DB_USER = 
   DB_PSW = 
   ```
5. Bundle application
   ```sh
   deno run bundle
   ```
6. Run application
   ```sh
   deno run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Screenshots

<p float="left">
  <img src="https://github.com/user-attachments/assets/b419d243-b01e-4823-bcf8-c9d607ba1cfe" width="49%" />
  <img src="https://github.com/user-attachments/assets/8fccd4cb-ff23-45e0-b501-089bf73706f0" width="49%" />
</p>
<p float="left">
  <img src="https://github.com/user-attachments/assets/a84a835f-85b4-4c18-9389-11bcadce00bf" width="32%" />
  <img src="https://github.com/user-attachments/assets/d4305717-4c94-48ee-bd5f-f63ba1735a93" width="32%" />
  <img src="https://github.com/user-attachments/assets/69e683b4-2ffe-4e68-9246-3a5a519411ab" width="32%" /> 
</p>



<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Plex authentication
- [x] User groups
- [x] Vote on movies
- [x] Movie results
- [ ] Refactor project types
- [ ] Update entire UI on ws message
- [ ] Optimize thumbnail loading
  - [ ] Placeholder images for loading


See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/griffinpj/plex-picks-ssr.svg?style=for-the-badge
[contributors-url]: https://github.com/griffinpj/plex-picks-ssr/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/griffinpj/plex-picks-ssr.svg?style=for-the-badge
[forks-url]: https://github.com/griffinpj/plex-picks-ssr/network/members
[stars-shield]: https://img.shields.io/github/stars/griffinpj/plex-picks-ssr.svg?style=for-the-badge
[stars-url]: https://github.com/griffinpj/plex-picks-ssr/stargazers
[issues-shield]: https://img.shields.io/github/issues/griffinpj/plex-picks-ssr.svg?style=for-the-badge
[issues-url]: https://github.com/griffinpj/plex-picks-ssr/issues
[license-shield]: https://img.shields.io/github/license/griffinpj/plex-picks-ssr.svg?style=for-the-badge
[license-url]: https://github.com/griffinpj/plex-picks-ssr/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/griffin-johnson-462393134/

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
