import app from './app';
import { connectDB } from './frameWork/database/connection/db';
import { seedInitialAdmin } from './frameWork/database/seed/seedAdmin';

const PORT = process.env.PORT || 5000;
console.log(process.env.GEMINI_API_KEY)
const startServer = async () => {
  try {
    await connectDB();
    await seedInitialAdmin();

    app.listen(PORT, () => {
      console.log(`[Server] FoodFlow Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('[Server Start Error]:', error);
    process.exit(1);
  }
};

startServer();
