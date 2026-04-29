# AWS Secrets Manager

Connect DSO to AWS Secrets Manager to manage application secrets securely at scale.

> [!IMPORTANT]
> The AWS provider is a **selective plugin**. You must install it before use:
> `docker dso system setup --providers aws`

## Configuration

```yaml
# dso.yaml - AWS Provider
provider: aws
config:
  region: us-east-1
  # Optional: Use IAM role instead of credentials
  # role_arn: arn:aws:iam::123456789012:role/dso-role

secrets:
  - name: prod/database/credentials
    inject: env
    rotation: true
    mappings:
      DB_USER: username
      DB_PASSWORD: password
      DB_HOST: host
```

## AWS Tag Support

DSO automatically injects secret tags as environment variables with `_TAG_` prefix.

Example: If your secret has tags:
- `environment: production`
- `service: api`

The following env vars are injected:
- `_TAG_ENVIRONMENT=production`
- `_TAG_SERVICE=api`

This enables rotation strategies based on tags.

## Prerequisites
- An AWS account with Secrets Manager enabled
- A secret already created in your target region
- IAM credentials with `secretsmanager:GetSecretValue` permission

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
