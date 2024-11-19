import { PlexOauth, IPlexClientDetails } from "npm:plex-oauth"

import { Movie } from '../../types/plex.ts';
import * as plexApi from './api.ts';

let clientInformation: IPlexClientDetails = {
    clientIdentifier: Deno.env.get('PLEX_CLIENT'), 
    product: Deno.env.get('PLEX_PRODUCT'),              
    device: "browser",
    version: "1",
    forwardUrl: Deno.env.get('PLEX_FORWARD_URL'),
    urlencode: true 
};
let plexOauth = new PlexOauth(clientInformation);

export const login = async () : Promise<{ url: string, pin: number }> => {
    try {
        const data = await plexOauth.requestHostedLoginURL();
        let [ hostedUILink, pinId ] = data;
        
        return new Promise((resolve) => resolve({ url: hostedUILink, pin: pinId }));

    } catch (e) { throw e}
};

export const checkForAuthToken = async (pinId: number) : Promise<string> => {
    try {
        const authToken = await plexOauth.checkForAuthToken(pinId);

        return new Promise((resolve) => resolve(authToken!));
    } catch (e) { throw (e); }
};

export async function getMoviesSample (options: { token: string, groupId: string, size: number, genres: string []}) : Promise<Movie []> {
    let movies = await plexApi.movies(options.groupId, options.token);

    if (options.genres && options.genres.length) {
        movies = movies.filter((movie: Movie) => movie.genre.some(g => options.genres.includes(g))); 
    }

    let seen = new Set();
    movies = movies.filter((movie: Movie) => {
        const title = movie.title.trim().toUpperCase();
        const hasSeen = seen.has(title);
        seen.add(title);
        return !hasSeen;
    });

    let sample: Movie[];
    let choices: number[] = [];
    while (choices.length < (options.size < movies.length ? options.size: movies.length)) {
        let r = Math.floor(Math.random() * movies.length);
        if (choices.indexOf(r) === -1) { choices.push(r) };
    }

    sample = choices.map((idx) => movies[idx]);
    return new Promise(resolve => resolve(sample));
}




