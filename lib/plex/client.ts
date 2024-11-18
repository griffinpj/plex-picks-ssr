import { PlexOauth, IPlexClientDetails } from "npm:plex-oauth"

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



