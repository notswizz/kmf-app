#!/bin/bash

read -p "Enter the commit message: " COMMITMESSAGE
git add -A
git commit -m "$COMMITMESSAGE"
git push origin master

echo
echo Deployment complete!
