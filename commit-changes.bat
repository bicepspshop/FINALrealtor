@echo off
echo Adding changes to Git...
git add .

echo Committing changes...
git commit -m "Add password recovery functionality and fix middleware redirects"

echo Pushing changes to GitHub...
git push origin main

echo Done!
pause
