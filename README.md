# casualcatalog

A catalog of dynamic content published to S3 and served via CloudFront.

## 🔗 CloudFront URL

Base:
**[https://d1vc1y3efsdgm8.cloudfront.net](https://d1vc1y3efsdgm8.cloudfront.net)**

Example usage:

```bash
https://d1vc1y3efsdgm8.cloudfront.net/boormantest.json?env=publicos.link
```

## 🚀 Deploying a New Version

To publish updates, push a Git tag:

* **Dev**: `dev/v123`, `dev/vNEXT` → must point to `dev` branch
* **Prod**: `prod/v123`, `prod/vNEXT` → must point to `main` branch

You can also manually trigger a deployment via GitHub Actions:

1. Go to the **Actions** tab.
2. Select **Publish casualcatalog \[DEV]** or **\[PROD]** workflow.
3. Click **Run workflow** and enter a tag like `dev/v123`.

Deployment syncs the `casualcatalog/` directory to the corresponding S3 bucket and creates a CloudFront cache invalidation.
