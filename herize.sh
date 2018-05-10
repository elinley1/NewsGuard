#!/bin/bash

git add -A 
git commit -m "Trying to fix"
git push heroku master
heroku logs -t -a floating-forest-51009