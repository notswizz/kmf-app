@echo off
SET /P COMMITMESSAGE="Enter the commit message: "
git add -A
git commit -m "%COMMITMESSAGE%"
git push origin master

echo.
echo Deployment complete!
pause
