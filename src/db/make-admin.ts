import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);

async function makeAdmin() {
  const email = "gambew@gmail.com";
  
  console.log(`🔧 Setting ${email} as admin...`);
  
  try {
    // Check if user exists
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if (users.length === 0) {
      console.log(`⚠️  User ${email} not found in database yet.`);
      console.log("   They need to sign in first, then run this script again.");
      console.log("   Or we can insert them as admin now...");
      
      // We can't insert without a clerk_id, so just inform
      console.log("\n   Option: After they sign in via Clerk, run this script again.");
      return;
    }
    
    // Update to admin
    await sql`UPDATE users SET role = 'admin' WHERE email = ${email}`;
    
    console.log(`✅ ${email} is now an admin!`);
  } catch (error) {
    console.error("❌ Failed:", error);
    process.exit(1);
  }
}

makeAdmin();

