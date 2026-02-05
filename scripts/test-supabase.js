const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// simple .env loader (no external deps)
const envPath = './.env';
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const m = line.match(/^([^#=]+)=['"]?(.*?)['"]?$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase env vars not found. Check .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

(async () => {
  try {
    console.log('Running test query: is_available=true, is_approved=true');
    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('is_available', true)
      .eq('is_approved', true)
      .limit(5);

    const processed = (data || []).map(p => {
      const imgs = (p.property_images || []);
      const urls = imgs.map(img => img.url || img.image_url || img.path || img.src).filter(Boolean);
      p.images = urls;
      if (!p.cover_image && urls.length) p.cover_image = urls[0];
      p.location = [p.province, p.city, p.neighborhood].filter(Boolean).join(', ');
      return p;
    });

    console.log('Supabase data:', processed);
    console.log('Supabase error:', error);

    // Fetch distinct rental_duration values
    const { data: rdData } = await supabase
      .from('properties')
      .select('rental_duration')
      .neq('rental_duration', null)
      .limit(1000);
    console.log('rental rows:', rdData);
    const rentalDurations = Array.from(new Set((rdData || []).map(r => r.rental_duration)));
    console.log('Distinct rental_duration values:', rentalDurations);
  } catch (err) {
    console.error('Exception when querying Supabase:', err);
  }
})();