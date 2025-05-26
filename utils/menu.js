import config from '../config.js';

export async function get_menu(uid) {
    try {
        const response = await fetch(config.menu_url, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "x-client-id": uid
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}