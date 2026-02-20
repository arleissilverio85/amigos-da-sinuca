import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://aoewnoyohqstluxbbsqm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZXdub3lvaHFzdGx1eGJic3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NTg3OTIsImV4cCI6MjA4NzEzNDc5Mn0.j3O5nntKorn0Y2DUzlsL3eb2z6oj-8OYQfWmLtBbXxk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);