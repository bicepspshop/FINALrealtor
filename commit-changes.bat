@echo off
echo Adding changes to Git...
git add .

echo Committing changes...
git commit -m "Add password recovery functionality"

echo Pushing changes to GitHub...
git push origin main

echo Done!
pause
