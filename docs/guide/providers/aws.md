# AWS Secrets Manager

This guide walks you through connecting DSO to AWS Secrets Manager.

## Prerequisites
- An AWS account with Secrets Manager enabled
- A secret already created in your target region
- IAM credentials with `secretsmanager:GetSecretValue` permission

## Configuration

```yaml
provider: aws
region: us-east-1

secrets:
  - name: prod/my-app/db-password
    inject: env
    as: DB_PASSWORD
  - name: prod/my-app/api-key
    inject: env
    as: API_KEY
```

## IAM Permissions

Attach the following policy to your IAM user or role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["secretsmanager:GetSecretValue"],
      "Resource": "arn:aws:secretsmanager:*:*:secret:prod/my-app/*"
    }
  ]
}
```

## Authentication

DSO uses the standard AWS credential chain. Set one of these:

```bash
# Option 1: Environment variables
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...

# Option 2: AWS profile
export AWS_PROFILE=my-profile
```

> [!TIP]
> On EC2 or ECS, DSO will automatically use the instance/task IAM role — no credentials needed.
