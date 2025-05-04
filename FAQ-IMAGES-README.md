# РиелторПро Help/FAQ System

This document explains how to use and manage the Help/FAQ page in the РиелторПро platform.

## Overview

The Help/FAQ system consists of:

1. A public Help/FAQ page with accordion-style guides for realtors
2. An admin interface for managing FAQ content and images
3. A Supabase storage bucket and database table for storing images
4. Utility scripts to help with image uploads and development

## Running the Development Server

If you're experiencing PowerShell security errors when running the development server, use one of these options:

### Option 1: Use the included batch file

Simply double-click the `start-dev.bat` file in the project root directory. This will start the development server with the correct PowerShell execution policy.

### Option 2: Use the PowerShell script directly

```powershell
# From project root
.\scripts\start-dev.ps1
```

### Option 3: Set execution policy and run manually

```powershell
# Set execution policy for the current session only
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned

# Run the development server
pnpm dev
```

## Managing FAQ Content

The FAQ content is stored directly in the React component source code at `app/help/page.tsx`. To modify the text content:

1. Edit the `app/help/page.tsx` file
2. Modify the text within the accordion items
3. Add or remove accordion items as needed

## Managing FAQ Images

Images for the FAQ are stored in the Supabase `Faq_images` table and displayed based on the `section` parameter. The available sections are:

- `create-collection` - Creating a collection
- `add-property` - Adding properties to a collection
- `edit-property` - Editing property information
- `share-collection` - Sharing collections with clients
- `track-clients` - Tracking client activity
- `profile-settings` - Profile settings
- `view-collection` - Viewing a collection

### Using the Admin Interface

1. Navigate to `/admin/help-images` in the application
2. Use the form to upload new images:
   - Select an image file
   - Enter a title
   - Enter an optional description
   - Select the section
   - Set the display order (or leave at 0 for automatic ordering)
3. Use the list on the right to view and manage existing images

### Uploading Images from Screenshots

You can use the included script to bulk upload screenshots:

1. Place your screenshots in a directory (e.g., `screenshots/`)
2. Run the upload script:

```bash
# Install dotenv if needed
pnpm add dotenv

# Run the upload script
node scripts/upload-faq-images.mjs ./screenshots
```

The script will:
- Attempt to determine the appropriate section for each image based on the filename
- Upload the images to Supabase storage
- Create database records in the `Faq_images` table

## Implementation Details

The Help/FAQ system uses these files:

- `app/help/page.tsx` - The public Help/FAQ page
- `app/admin/help-images/page.tsx` - The admin interface for managing images
- `lib/faq-storage.ts` - Functions for working with the Supabase storage and database
- `utils/storage-helpers.ts` - Helper functions for storage operations

## Troubleshooting

If you're having issues with images not appearing:

1. Check the browser console for any errors
2. Verify that the images exist in the `Faq_images` table with the correct section values
3. Make sure the image URLs are accessible
4. Verify that you have the `faq-images` bucket in Supabase Storage

If you encounter permission issues:

1. Make sure the Supabase storage bucket is public
2. Check that your Supabase API keys are correctly configured in `.env.local`
3. Verify that your user account has admin rights to access the admin interface 