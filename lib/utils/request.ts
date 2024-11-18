import * as convert from 'npm:xml-js';

export async function get (url: string, type = 'json') {
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        switch (type) {
            case 'json':
                return response.json();
            case 'xml':
                const xml = await response.text();
                const json = JSON.parse(convert.xml2json(xml));
                return new Promise((resolve) => resolve(json));                
            case 'img': 
                return response.blob();
            default:
                return response.text();
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export async function post (url: string, data: {}) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Replace this with your actual data
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

