@echo off
if not exist "mongo-data" mkdir "mongo-data"
start "MongoDB" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "mongo-data" --port 27017
echo MongoDB Started in a separate window.
pause
