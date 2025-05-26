const config = {
    rules: "Act as if you are the human user of an AI application, and I am your AI assistant. Please prompt me with one clear, super short sentence in colloquial language, without greetings or compliments!",
    history_folder_path: "history",
    menu_url: "https://chat.target.com/api/usage/me",
    target_url: "https://chat.target.com/api/chat/",
    ip_checker_url: "http://httpbin.org/ip",
    bot_url: "http://localhost:11434/api/chat", //url LLM bot
    bot_model: "llama3.2", //model LLM bot
    bot_temperature: 1.1,
    min_rand_conversations_round: 1, //min banyak percakapan dalam 1 chat (random)
    max_rand_conversations_round: 3, //max banyak percakapan dalam 1 chat (random)
    min_rand_chats_round: 1, //min banyak new chat dalam 1 user (random)
    max_rand_chats_round: 3, //max banyak new chat dalam 1 user (random)
    worker_num: 1, //banyak user diwaktu bersamaan dalam 1 session
    session_num: 100, //banyak session
    socks_proxy_addresses: [ //set di /tor
        "127.0.1.0:9050",
        "127.0.1.1:9050",
        "127.0.2.0:9050",
        "127.0.2.1:9050",
        "127.0.3.0:9050",
        "127.0.3.1:9050",
    ]
};

export default config;