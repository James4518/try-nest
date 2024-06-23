const dotenv = require('dotenv')

dotenv.config()
dotenv.config({ path: '.env.development' });
dotenv.config({ path: '.env.production' });

const { SERVER_HOST, SERVER_PORT } = process.env;

export {
  SERVER_HOST,
  SERVER_PORT,
} 