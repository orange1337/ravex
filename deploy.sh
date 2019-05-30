git add .
git commit -m $1
git push
ssh root@95.216.157.77 "cd /opt/ravex && ./build.sh ravex"