#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * This script helps set up the masterplan image.
 *
 * The image file needs to be saved at: public/images/alzumuruda-masterplan.jpg
 *
 * Steps:
 * 1. Right-click the uploaded image in Claude Code chat
 * 2. Select "Save image as"
 * 3. Navigate to: alaqtar-replica/public/images/
 * 4. Save as: alzumuruda-masterplan.jpg
 * 5. Run this script: node scripts/setup-image.js
 */

const imagePath = path.join(__dirname, '..', 'public', 'images', 'alzumuruda-masterplan.jpg');
const publicImagesDir = path.dirname(imagePath);

// Ensure directory exists
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
  console.log(`✓ Created directory: ${publicImagesDir}`);
}

// Check if image exists
if (fs.existsSync(imagePath)) {
  console.log(`✓ Image found at: ${imagePath}`);
  console.log('✓ Setup complete! The masterplan image is ready.');
} else {
  console.log(`⚠ Image not found at: ${imagePath}`);
  console.log('\nTo fix this:');
  console.log('1. In Claude Code, right-click the uploaded ALZUMURUDA logo image');
  console.log('2. Select "Save image as"');
  console.log(`3. Navigate to: ${publicImagesDir}`);
  console.log('4. Save as: alzumuruda-masterplan.jpg');
  console.log('\nThen the app will display the new masterplan image.');
}
