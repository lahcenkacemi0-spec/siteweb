const supabaseUrl = 'https://ljdpeafhvtqurdqkzhnr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqZHBlYWZodnRxdXJkcWt6aG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzQzOTEsImV4cCI6MjA4ODk1MDM5MX0._vmTOG-vfioazOf7pIPIo8hzAl7yxe1krKQfBAZO6GY';
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

window.supabaseClient = _supabase;
