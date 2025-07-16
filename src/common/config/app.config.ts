export const EnvConfiguration = () => {
    return {
        enviroment: process.env.NODE_ENV ?? 'development',
        mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/pokedex',
        port: process.env.PORT ?? 3001,
        defaultLimit: process.env.DEFAULT_LIMIT ?? 10,
    };
};