#Build only for master and if its not a PR
docker build -t "argonlaser/badgeit-front:$BRANCH_NAME.$SEMAPHORE_BUILD_NUMBER" .
docker images
docker push argonlaser/badgeit-front:$BRANCH_NAME.$SEMAPHORE_BUILD_NUMBER