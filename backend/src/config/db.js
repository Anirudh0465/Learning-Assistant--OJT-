import mongoose from 'mongoose';

const DB_STATES = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
};

export const getDatabaseStatus = () => ({
    readyState: mongoose.connection.readyState,
    state: DB_STATES[mongoose.connection.readyState] || 'unknown',
    host: mongoose.connection.host || null,
});
const connectDB = async()=>{
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error('MONGO_URI is not set. Backend started without DB connection.');
        return false;
    }
    try{
        const conn = await mongoose.connect(mongoUri);
        console.log(`Database Connected: ${conn.connection.host}`);
        return true;
    }catch(error){
        console.log('Database connection failed:');
        console.error(error.message);
        return false;
    }
};
export default connectDB;