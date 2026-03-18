
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MyAwsWebappStack } from '../lib/my-aws-webapp-stack';

const app = new cdk.App();
new MyAwsWebappStack(app, 'MyAwsWebappStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the CLI configuration currently on disk. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT!, region: process.env.CDK_DEFAULT_REGION! },

  /* You may pass any of the following as props to specialize:
   *   - `stackName`: short, unique name for the stack
   *   - `domainName`: custom domain name (defaults to random)
   *   - `env`: specify environment (account/region)
   */
});

// CDK v2 synth validation
app.synth();
