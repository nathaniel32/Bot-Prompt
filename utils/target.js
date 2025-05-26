import config from '../config.js';
import { scanf } from './utils.js';
import fetch from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';

config.socks_proxy_addresses.forEach((address, index) => {
    console.log(index, address);
});
let input = await scanf('=> ID Address: ');
console.log("Adress: ", config.socks_proxy_addresses[input], "\n")
const agent = new SocksProxyAgent('socks5h://' + config.socks_proxy_addresses[input]);

export async function check_ip_proxy() {
    try {
        const res = await fetch(config.ip_checker_url, { agent });
        const data = await res.json();
        console.log(`\n=>IP: ${data.origin}\n`);
        return true;
    } catch (err) {
        //console.error('!!Fetch failed via Proxy!!');
        return false;
    }
}

export async function prompt_target(agent_id, uid, activity_id, prompt_text) {
    const maxRetries = 3;
    const delay = 1000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(config.target_url + agent_id, {
                method: "POST",
                agent,
                headers: {
                    "content-type": "application/json",
                    "x-client-id": uid
                },
                body: JSON.stringify({ prompt: prompt_text, activityId: activity_id })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            //console.error(error);
            console.error(`Target Error on attempt ${attempt}`);
            if (attempt === maxRetries) {
                return null;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}