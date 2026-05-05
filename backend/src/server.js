const mongoose = require("mongoose");
const { app, ensureDefaultAdmin } = require("./app");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

async function bootstrap() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in environment.");
  }

  await mongoose.connect(MONGODB_URI);
  await ensureDefaultAdmin();

  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});
