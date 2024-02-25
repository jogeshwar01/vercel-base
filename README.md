# Vercel

In build-server/script.js, the command contains rm package-lock.json.
This is not needed for normal projects, the testing one had an issue here so I included this line.
Remove in main app

Note: Log in to docker desktop beforehand to prevent multiple docker clashes. If not logged in, see pt. 7.

### Setting up AWS ECR and ECS -

1. Need `awscli version 2` - to allow ecr login in aws cli -
   aws installation First uninstall (using pip/pip3 uninstall) and then run the 3 commands given on https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html. Reboot system if not showing up directly on aws --version

2. Update IAM policy for user - add policy `AmazonEC2ContainerRegistryFullAccess` to `IAM` user

3. On local machine, setup aws configure Then setup aws config using command `aws configure --profile <profile_name>`. Here set output to json (check reason).

4. Set default config. After creating a config in profile, to set it to default to see it in aws configure list -> `export AWS_DEFAULT_PROFILE=<profile_name>`

5. Solve docker scan error - go to ~/.docker/config.json, remove the line with key `credsStore`, then start the command given by `ecr login`.

6. To delete aws configuration remove `~/.aws/credentials` along with `~/.aws/config`

7. Run the 4 push commands given on `AWS ECR` (make sure to have docker desktop logged in for this).
   Workaround - create docker-compose and build an image through it. Can skip 2nd step in ECR in that case.

8. Go to `ECS`, create a cluster. To test, run a new task in cluster with desired image. Use `AWS Fargate` (serverless) option.

9. Set these env variables in container overrides.

```
AWS_SECRET_KEY=
AWS_ACCESS_KEY=
AWS_REGION_NAME=
AWS_S3_BUCKET=
PROJECT_ID=
GIT_REPOSITORY__URL=
```
