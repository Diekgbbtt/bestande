const url = 'mongodb://127.0.0.1:27017/bestande';

export const dbUrl = () => process.env.MONGODB_URI || url;

