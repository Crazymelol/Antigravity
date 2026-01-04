import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ifelmkxmbegztyjxlzfi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZWxta3htYmVnenR5anhsemZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDQ4MjgsImV4cCI6MjA4MTQyMDgyOH0.y1aQe0Oq5uxCyf1VAM05qqhm-XvGb0K09uM0wFJGbgo";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
    console.log("Testing Supabase Connection...");

    // Simple query: Count profiles
    const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error("Connection Failed:", error.message);
    } else {
        console.log("Connection Success! ✅");
        console.log(`Database is live and accessible. Current Profile Count: ${count}`);
    }
}

testConnection();
