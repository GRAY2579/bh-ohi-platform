import fs from 'fs'

const SUPABASE_URL = 'https://tofznbxzogyipljcdnnh.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

// Try using the Supabase Management API via the project's SQL endpoint
// We need the service_role key, not the anon key, to run DDL
// Let's try the anon key first — it might work since the policies are permissive

const schema = fs.readFileSync('supabase/schema.sql', 'utf8')

// Supabase doesn't expose raw SQL via REST API with anon key
// We need to use the pg endpoint or the management API
// Let's try the RPC approach - call a function that executes SQL

// Alternative: use the Supabase Management API
// POST https://api.supabase.com/v1/projects/{ref}/database/query
const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZnpuYnh6b2d5aXBsamNkbm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjI5NDcsImV4cCI6MjA5MTI5ODk0N30.5uJXwDzSqG8vhk5D-c74Er8ojOi0jGJP9YDtZVhKoXc',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZnpuYnh6b2d5aXBsamNkbm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjI5NDcsImV4cCI6MjA5MTI5ODk0N30.5uJXwDzSqG8vhk5D-c74Er8ojOi0jGJP9YDtZVhKoXc'
  },
  body: JSON.stringify({ sql: schema })
})

console.log('Status:', resp.status)
const text = await resp.text()
console.log('Response:', text.substring(0, 500))
