import nodeFetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';

export const fetch = fetchCookie(nodeFetch);
