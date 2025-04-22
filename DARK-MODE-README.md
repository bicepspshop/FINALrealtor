# Dark Mode Image Setup

## Issue
The dark mode images are currently being requested from incorrect paths, resulting in 404 errors. The browser console shows errors like:

```
backnight.png:1 Failed to load resource: the server responded with a status of 404 (Not Found)
flat0.png:1 Failed to load resource: the server responded with a status of 404 (Not Found)
```

## Solution

In Next.js, static files must be placed in the `/public` directory to be served correctly. The dark mode images are currently in the `/images` directory at the root of the repository, but they need to be moved to `/public/images`.

### Option 1: Move Images Manually

1. Move all the following files from `/images` to `/public/images`:
   - `backnight.png`
   - `flat0.png`
   - `flat1.png`
   - `flat2.png`
   - `flat3.png`
   - `flat4.png`
   - `flat5.png`
   - `flat6.png`
   - `flat7.png`
   - `flat8.png`
   - `flat9.png`

### Option 2: Use the Provided PowerShell Script

For Windows users, a PowerShell script has been created to automate this process:

1. Open PowerShell or Command Prompt
2. Navigate to the project directory
3. Run the script:
   ```
   powershell -ExecutionPolicy Bypass -File .\move-images.ps1
   ```

## Temporary Fallback

Until the images are properly moved, the application will fall back to using the light mode images even when in dark mode to prevent broken images.

## Verifying the Fix

After moving the images:
1. Restart the development server
2. Toggle to dark mode
3. Verify that the dark mode images are now displayed correctly

## Image Path Format

All image paths should follow this format:
- Light mode images: `/images/house1.png`
- Dark mode images: `/images/flat1.png`

The ThemeImage component will handle switching between these paths based on the current theme.
