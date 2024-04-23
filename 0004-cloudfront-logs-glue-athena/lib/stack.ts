import * as cdk from 'aws-cdk-lib';
import { aws_cloudfront, aws_s3, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as aws_glue_alpha from '@aws-cdk/aws-glue-alpha';

export class CloudFrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a dedicated S3 bucket to store CloudFront logs
    const logBucket = new aws_s3.Bucket(this, 'CloudFrontLogs', {
      // ACL, required by CloudFront
      objectOwnership: aws_s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
      // Make sure we don't keep unnecessary data after we delete this stack
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    const distribution = new aws_cloudfront.Distribution(this, 'Distribution', {
      // HTTPS (because we should ALWAYS use HTTPS!)
      sslSupportMethod: aws_cloudfront.SSLMethod.SNI,

      // Enable logging to the S3 bucket
      enableLogging: true,
      logBucket: logBucket,

      // Use the wonderful https://reqres.in/ as a destination for our calls
      defaultBehavior: {
        origin: new HttpOrigin('reqres.in')
      }
    });
    // This output will contain the domain name of the distribution,
    // e.g. xxxxxxx.cloudfront.net
    new CfnOutput(this, 'DistributionDomainName', {
      value: distribution.domainName
    });

    // Create a database where to store the table
    const database = new aws_glue_alpha.Database(this, 'GlueDatabase', {
      // Give the database a friendly name (lower-case only!)
      databaseName: Stack.of(this).stackName + '-database'
    });
    new CfnOutput(this, 'CloudFrontLogsDatabaseName', {
      value: database.databaseName
    });

    // Create the table that maps each log line
    const table = new aws_glue_alpha.S3Table(this, 'CloudFrontLogsTable', {
      // Give the table a friendly name (lower-case only!)
      tableName: Stack.of(this).stackName + '-cloudfrontlogstable',

      // The source bucket for this Glue table
      bucket: logBucket,
      database: database,

      // Full SQL reference: https://docs.aws.amazon.com/athena/latest/ug/cloudfront-logs.html
      columns: [
        { name: 'date', type: aws_glue_alpha.Schema.DATE },
        { name: 'time', type: aws_glue_alpha.Schema.STRING },
        { name: 'x_edge_location', type: aws_glue_alpha.Schema.STRING },
        { name: 'sc_bytes', type: aws_glue_alpha.Schema.BIG_INT },
        { name: 'c_ip', type: aws_glue_alpha.Schema.STRING },
        { name: 'cs_method', type: aws_glue_alpha.Schema.STRING },
        { name: 'cs_host', type: aws_glue_alpha.Schema.STRING },
        { name: 'cs_uri_stem', type: aws_glue_alpha.Schema.STRING },
        { name: 'sc_status', type: aws_glue_alpha.Schema.INTEGER },
        { name: 'cs_referrer', type: aws_glue_alpha.Schema.STRING },
        { name: 'cs_user_agent', type: aws_glue_alpha.Schema.STRING },
        { name: 'cs_uri_query', type: aws_glue_alpha.Schema.STRING },
        { name: 'cs_cookie', type: aws_glue_alpha.Schema.STRING },
        { name: 'x_edge_result_type', type: aws_glue_alpha.Schema.STRING },
        { name: 'x_edge_request_id', type: aws_glue_alpha.Schema.STRING },
        { name: 'x_host_header', type: aws_glue_alpha.Schema.STRING },
        { name: 'cs_protocol', type: aws_glue_alpha.Schema.STRING },
        { name: 'cs_bytes', type: aws_glue_alpha.Schema.BIG_INT },
        { name: 'time_taken', type: aws_glue_alpha.Schema.FLOAT },
        { name: 'x_forwarded_for', type: aws_glue_alpha.Schema.STRING },
        { name: 'ssl_protocol', type: aws_glue_alpha.Schema.STRING },
        { name: 'ssl_cipher', type: aws_glue_alpha.Schema.STRING },
        { name: 'x_edge_response_result_type', type: aws_glue_alpha.Schema.STRING },
        { name: 'cs_protocol_version', type: aws_glue_alpha.Schema.STRING },
        { name: 'fle_status', type: aws_glue_alpha.Schema.STRING },
        { name: 'fle_encrypted_fields', type: aws_glue_alpha.Schema.INTEGER },
        { name: 'c_port', type: aws_glue_alpha.Schema.INTEGER },
        { name: 'time_to_first_byte', type: aws_glue_alpha.Schema.FLOAT },
        { name: 'x_edge_detailed_result_type', type: aws_glue_alpha.Schema.STRING },
        { name: 'sc_content_type', type: aws_glue_alpha.Schema.STRING },
        { name: 'sc_content_len', type: aws_glue_alpha.Schema.BIG_INT },
        { name: 'sc_range_start', type: aws_glue_alpha.Schema.BIG_INT },
        { name: 'sc_range_end', type: aws_glue_alpha.Schema.BIG_INT }
      ],

      // Define the right settings to parse CloudFront logs
      dataFormat: aws_glue_alpha.DataFormat.TSV,
      parameters: {
        // THESE PARAMETERS ARE VERY IMPORTANT
        'skip.header.line.count': '2',
        'serialization.format': '\t',
        'field.delim': '\t'
      }
    });
    new CfnOutput(this, 'CloudFrontLogsTableName', {
      value: table.tableName
    });
  }
}
