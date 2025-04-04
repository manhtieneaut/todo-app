import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gisajdujenezhgpjwuxe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpc2FqZHVqZW5lemhncGp3dXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1ODY4NDIsImV4cCI6MjA1OTE2Mjg0Mn0.N74a84xgTt1D_B2hoyRdSaSvEyN5Teq9GO835wFSIMk";

export const supabase = createClient(supabaseUrl, supabaseKey);
