import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { randomUUID } from 'crypto';

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

/**
 * Persists a contact request to DynamoDB and publishes
 * an SNS notification to the configured topic.
 * In local development, logs to console instead of hitting AWS.
 */
export async function submitContactRequest(args: ContactRequest): Promise<void> {
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  if (process.env['OPENAI_API_KEY']) {
    console.log('[contact] local dev — skipping DynamoDB/SNS');
    console.log(`[contact] id: ${id}`);
    console.log(`[contact] name: ${args.name}`);
    console.log(`[contact] email: ${args.email}`);
    console.log(`[contact] message: ${args.message}`);
    console.log(`[contact] createdAt: ${createdAt}`);
    return;
  }

  const dynamo = new DynamoDBClient({});
  const sns = new SNSClient({});

  await dynamo.send(
    new PutItemCommand({
      TableName: process.env['CONTACT_TABLE_NAME'],
      Item: {
        id: { S: id },
        name: { S: args.name },
        email: { S: args.email },
        message: { S: args.message },
        createdAt: { S: createdAt },
      },
    }),
  );

  await sns.send(
    new PublishCommand({
      TopicArn: process.env['CONTACT_SNS_TOPIC_ARN'],
      Subject: `New contact request from ${args.name}`,
      Message: [
        `Name: ${args.name}`,
        `Email: ${args.email}`,
        `Message: ${args.message}`,
        `Received: ${createdAt}`,
      ].join('\n'),
    }),
  );
}
