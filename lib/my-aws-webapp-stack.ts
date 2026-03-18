import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class MyAwsWebappStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for React app
    const bucket = new s3.Bucket(this, 'WebappBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Lambda for /api/message (OpenAI proxy)
    const apiHandler = new lambda.Function(this, 'ApiHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromInline(`
        const axios = require('axios');
        exports.handler = async (event) => {
          const body = JSON.parse(event.body || '{}');
          // Mock AI response (replace with real OpenAI)
          const reply = \`🤖 AI: You said "${body.message}". This is serverless Lambda!\`;
          return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ reply })
          };
        };
      `),
      handler: 'index.handler',
    });

    // API Gateway
    const api = new apigateway.LambdaRestApi(this, 'Endpoint', {
      handler: apiHandler,
      proxy: false,
    });

    const messages = api.root.addResource('api').addResource('message');
    messages.addMethod('POST');

    // CloudFront CDN
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [{
        s3OriginSource: { s3BucketSource: bucket },
        behaviors: [{ isDefaultBehavior: true }]
      }],
    });

    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
  }
}


    new cdk.CfnOutput(this, 'CloudFrontURL', { value: distribution.distributionDomainName });
    new cdk.CfnOutput(this, 'ApiURL', { value: api.url });
  }
}
