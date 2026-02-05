Mobile Alignment QA Checklist

1) Setup
- Ensure local .env (or environment) has Supabase keys set.
- Start Metro: `npx expo start -c` and open on emulator/device.

2) Home screen
- Open the app, confirm Home loads with featured and latest properties.
- Console (Metro) should show `Supabase data:` logs and `Supabase error: null`.
- Each `PropertyCard` should show:
  - Main image (or placeholder)
  - **Type** badge (e.g., "Apartamento")
  - **Status** badge (e.g., "usado") on top-right
  - Formatted price using `currency` from the row (eg. AOA)
  - Location text composed from `province, city, neighborhood`.
  - Heart button on bottom-right; tap it to toggle favorite (optimistic UI)

3) Favorites behavior
- Tap heart on any property; it should toggle immediately (optimistic)
- If not logged in, an alert asks to sign in
- To verify persistence: go to the `Favoritos` screen (Favorites), it should list favorited properties (refresh may be needed)
- Console logs for add/remove favorite calls will appear in Metro logs

4) Search screen
- Run a search; results should show `PropertyCard` instances with favorite toggles working the same way

5) Property details
- Tap a property to open `PropertyDetail`:
  - Horizontal image carousel shows property images (or cover_image)
  - Title with badges (type and status)
  - Location and formatted price
  - Quick cards for bedrooms, baths, area
  - Comodidades list (e.g., estacionamento, piscina, jardim, seguranca) based on `amenities` or boolean fields
  - Fixed bottom action bar with three buttons: Favorite (heart), Agendar Visita, Entrar em Contato
  - Heart button should use optimistic toggle and persist

6) RLS & data integrity
- No errors about enums or unknown columns should appear in Metro logs when interacting (e.g., 42703 or similar)
- All queries are read-only except favorites insert/delete which are safe and respect `user_id` constraints

7) Logs to check
- Look for `Supabase data:` and `Supabase error:` logs in Metro (console)
- Look for `Supabase data (addFavorite):` and `Supabase data (removeFavorite):` when toggling favorites

If anything fails, capture the Metro logs and share the exact error message so I can fix it quickly.w