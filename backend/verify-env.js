import 'dotenv/config';

console.log('\n🔍 Environment Variables Check\n');
console.log('================================\n');

const requiredVars = [
  'PORT',
  'NODE_ENV',
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'GEMINI_API_KEY',
  'GEMINI_MODEL',
  'CLIENT_URL'
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const display = value ? (varName.includes('KEY') || varName.includes('SECRET') || varName.includes('URI') 
    ? `${value.substring(0, 10)}...` 
    : value) : 'NOT SET';
  
  console.log(`${status} ${varName.padEnd(25)} = ${display}`);
  
  if (!value) allPresent = false;
});

console.log('\n================================\n');

if (allPresent) {
  console.log('✅ All required environment variables are set!\n');
  
  // Additional checks
  console.log('📋 Additional Checks:\n');
  
  // Check Gemini Model
  const model = process.env.GEMINI_MODEL;
  if (model === 'gemini-2.5-flash-lite') {
    console.log('✅ GEMINI_MODEL is correctly set to gemini-2.5-flash-lite');
  } else {
    console.log(`⚠️  GEMINI_MODEL is "${model}" - recommended: "gemini-2.5-flash-lite"`);
  }
  
  // Check CLIENT_URL
  const clientUrl = process.env.CLIENT_URL;
  if (clientUrl.includes('vercel.com/') && clientUrl.includes('/settings')) {
    console.log('❌ CLIENT_URL is pointing to Vercel settings page!');
    console.log('   Update it to your actual frontend URL (e.g., https://your-app.vercel.app)');
  } else if (clientUrl.startsWith('http://localhost')) {
    console.log('⚠️  CLIENT_URL is localhost - OK for development, but update for production');
  } else if (clientUrl.startsWith('https://')) {
    console.log('✅ CLIENT_URL looks correct for production');
  } else {
    console.log('⚠️  CLIENT_URL format might be incorrect');
  }
  
  // Check NODE_ENV
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') {
    console.log('✅ NODE_ENV is set to production');
  } else {
    console.log(`ℹ️  NODE_ENV is "${nodeEnv}" - set to "production" for deployment`);
  }
  
  console.log('\n');
} else {
  console.log('❌ Some required environment variables are missing!\n');
  console.log('Please set all required variables in your .env file or deployment platform.\n');
  process.exit(1);
}
