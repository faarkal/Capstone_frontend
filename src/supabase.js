import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vjbxeytljthsbviclvyp.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYnhleXRsanRoc2J2aWNsdnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjY2NzEsImV4cCI6MjA5MzgwMjY3MX0.KNtHlaG_6ENx4s91eMpgoqjOdGAl7I3IkeNgr-UZLcQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
