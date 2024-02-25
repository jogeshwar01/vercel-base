# Vercel

In build-server/script.js, the command contains rm package-lock.json.
This is not needed for normal projects, the testing one had an issue here so I included this line.
Remove in main app

For now, need to setup these in task in AWS ECS task (move AWS ones to env later)

```
AWS_SECRET_KEY=
AWS_ACCESS_KEY=
AWS_REGION_NAME=
AWS_S3_BUCKET=
PROJECT_ID=
GIT_REPOSITORY__URL=
```
