
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MyAwsWebappStack } from '../lib/my-aws-webapp-stack';

const app = new cdk.App();
new MyAwsWebappStack(app, 'MyAwsWebappStack', {});
app.synth();
