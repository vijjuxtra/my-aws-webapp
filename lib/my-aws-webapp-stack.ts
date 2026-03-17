
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export class MyAwsWebappStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 + CloudFront
    const bucket = new s3.Bucket(this, 'WebBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [{ s3OriginSource: { s3BucketSource: bucket } }]
    });

    // DynamoDB + Lambda + API Gateway
    const table = new dynamodb.Table(this, 'DataTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    const apiLambda = new lambda.Function(this, 'ApiHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'api-handler.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: { TABLE_NAME: table.tableName }
    });

    table.grantReadWriteData(apiLambda);

    const api = new apigateway.LambdaRestApi(this, 'ApiGateway', {
      handler: apiLambda,
      proxy: false
    });

    new cdk.CfnOutput(this, 'CloudFrontURL', { value: distribution.distributionDomainName });
    new cdk.CfnOutput(this, 'ApiURL', { value: api.url });
  }
}
