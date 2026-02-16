const config = {
    // REPLACE THIS with your 'npx localtunnel --port 5000' URL
    // Example: 'https://smart-fox-22.loca.lt/api'
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

    // other config
    minWithdrawal: 5000,
    dailyReward: 100,
};

export default config;
