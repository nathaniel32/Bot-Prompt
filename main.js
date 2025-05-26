import { scanf, worker } from './utils/utils.js';
import { check_ip_proxy } from './utils/target.js';
import { get_menu } from './utils/menu.js';
import config from './config.js';
import { randomUUID } from 'crypto';
import fs from 'fs';

(async () => {
    if (await check_ip_proxy()){
        const uid = randomUUID();
        const menu = await get_menu(uid);
        if (menu){
            
            menu.forEach((element, index) => {
                console.log(index, element.name)
            });
            let input = await scanf('=> ID Menu: ');
            input = parseInt(input);
            console.log("AgentId\t\t:", menu[input].agentId);
            console.log("AgentSlug\t:", menu[input].agentSlug);
            console.log("Count\t\t:", menu[input].count);
            console.log("Name\t\t:", menu[input].name);
            console.log("Description\t:", menu[input].description);
            console.log("\n\n");
            
            const menu_history_path = `${config.history_folder_path}/${menu[input].agentId}`;
            if (!fs.existsSync(menu_history_path)) {
                fs.mkdirSync(menu_history_path, { recursive: true });
            }
            
            for (let i = 0; i < config.session_num; i++) {
                const promises = [];
                for (let i = 0; i < config.worker_num; i++) {
                    promises.push(worker(menu[input], menu_history_path));
                }
                await Promise.all(promises);
                await check_ip_proxy();
            }
        }else{
            console.log("=> Menu Error!");
        }
        console.log("\n==================== ALL END");
    }else{
        console.log("=> Proxy Error!");
    }
})();