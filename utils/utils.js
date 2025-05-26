import { prompt_bot } from './bot.js';
import { prompt_target } from './target.js';
import config from '../config.js';
import fs from 'fs';
import readline from 'readline';
import { randomUUID } from 'crypto';

export function scanf(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

function add_chat(messages, role, name, content, uid) {
    messages.push({ role: role, content: content});
    console.log(`\n${uid} : ${name}\t: `, content.replace(/\\n/g, ' ').replace(/\n/g, ' ').replace(/\\"/g, ' ').replace(/\\'/g, ' ').replace(/\\r/g, ' ').replace(/\\\\/g, ' ').replace(/"/g, '').replace(/["']/g, '').replace(/-+/g, ', ').replace(/\*/g, ' ').replace(/_/g, ' ').replace(/`+/g, ' ').replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim());
}

async function chat(first_prompt, agent_id, uid) {
    let activity_id = null;
    const conversation_history = [];
    if (config.rules) {
        add_chat(conversation_history, "system", "System", config.rules, uid);
    }
    add_chat(conversation_history, "user", "Topic", first_prompt, uid);
    //let current_prompt = first_prompt;

    for (let i = 0; i < Math.floor(Math.random() * (config.max_rand_conversations_round - config.min_rand_conversations_round + 1)) + config.min_rand_conversations_round; i++) {
        //console.log("\n============================================");
        const llm_response = await prompt_bot(conversation_history);
        if (llm_response){
            add_chat(conversation_history, "assistant", "Bot", llm_response, uid);
        
            const target_response = await prompt_target(agent_id, uid, activity_id, llm_response);
            if (target_response && typeof target_response === 'object' && 'answer' in target_response){
                add_chat(conversation_history, "user", "Server", target_response.answer, uid);
                activity_id = target_response.activityId;
                //current_prompt = target_response;
            }else{
                add_chat(conversation_history, "user", "Server", "ERROR, " + target_response, uid);
                break;
            }
        }else{
            console.log("Bot Error!");
        }
    }
    return {activity_id, conversation_history};
}

export async function worker(selected_menu, menu_history_path) {
    const uid = randomUUID();
    const chat_history = []
    const agent_id = selected_menu.agentId;
    const agent_name = selected_menu.name;
    console.log("User-ID: ",uid);

    for (let i = 0; i < Math.floor(Math.random() * (config.max_rand_chats_round - config.min_rand_chats_round + 1)) + config.min_rand_chats_round; i++) {
        const chat_result = await chat(selected_menu.description, agent_id, uid);
        if (chat_result.activity_id){
            chat_history.push(chat_result);
        }else{
            console.log("chat is empty!");
        }
    }
    if (chat_history.length > 0){
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${timestamp}_${uid}.json`;
        fs.writeFileSync(`${menu_history_path}/${filename}`, JSON.stringify({agent_id, agent_name, uid, chat_history}, null, 2));
    }else{
        console.log("history is empty!");
    }
    console.log("\n==================== END: ", uid);
}