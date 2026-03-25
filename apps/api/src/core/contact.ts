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
 */
export async function submitContactRequest(args: ContactRequest): Promise<void> {
  const dynamo = new DynamoDBClient({});
  const sns = new SNSClient({});

  const id = randomUUID();
  const createdAt = new Date().toISOString();

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
