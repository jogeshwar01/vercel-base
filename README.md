# Vercel

In build-server/script.js, the command contains rm package-lock.json.
This is not needed for normal projects, the testing one had an issue here so I included this line.
Remove in main app

Note: Log in to docker desktop beforehand to prevent multiple docker clashes. If not logged in, see pt. 7.

##### PORTS

-   api-server - 9001
-   s3-reverse-proxy - 900

### Setting up AWS ECR and ECS - build-server

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

### AWS S3 - build-sever

1. To allow s3 files download from anywhere, set public access policy in bucket permissions

2. First set `Block all public access` to false

3. Add this policy in `Permissions/Bucket Policy`

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::vercel-store/*"
        }
    ]
}
```

4. Example - If PROJECT_ID=p1 and proxy server at 9000
   Site accessible at `p1.localhost:9000`

### API Setup for ECS/Fargate - api-server

1. Set these env variables for ecs.  
   We also need `Security Groups` and `Subnets` for `networkConfiguration`. Can get these in Networking tab when we do a `Run new task` from a ecs cluster.
   For ecs image name, get it from `Task definitions` in `JSON` tab in ecs

```
AWS_SECRET_KEY=
AWS_ACCESS_KEY=
AWS_REGION_NAME=
AWS_S3_BUCKET=
AWS_ECS_CLUSTER_ARN=
AWS_ECS_TASK_ARN=
AWS_ECS_IMAGE_NAME=
AWS_ECS_SUBNETS=
AWS_ECS_SECURTIY_GROUPS=
PROXY_PORT=(s3-reverse-proxy server port)
```
