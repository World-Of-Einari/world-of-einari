import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { randomUUID } from 'crypto';
import { logger } from '../core/logger';

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export function validateContactRequest(args: ContactRequest): void {
  if (!args.name?.trim() || args.name.length > 200) {
    throw new Error('Invalid name');
  }
  if (
    !args.email?.trim() ||
    args.email.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)
  ) {
    throw new Error('Invalid email');
  }
  if (!args.message?.trim() || args.message.length > 2000) {
    throw new Error('Invalid message');
  }
}

/**
 * Persists a contact request to DynamoDB and publishes
 * an SNS notification to the configured topic.
 * In local development, logs to console instead of hitting AWS.
 */
export async function submitContactRequest(args: ContactRequest): Promise<void> {
  validateContactRequest(args);

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  if (process.env['NODE_ENV'] !== 'production') {
    logger.info('[submitContactRequest] local dev — skipping DynamoDB/SNS');
    logger.info(`[submitContactRequest] id: ${id}`);
    logger.info(`[submitContactRequest] name: ${args.name}`);
    logger.info(`[submitContactRequest] email: ${args.email}`);
    logger.info(`[submitContactRequest] message: ${args.message}`);
    logger.info(`[submitContactRequest] createdAt: ${createdAt}`);
    return;
  }

  const dynamo = new DynamoDBClient({});
  const sns = new SNSClient({});

  const expiresAt = Math.floor(Date.now() / 1000) + 180 * 24 * 60 * 60;

  await dynamo.send(
    new PutItemCommand({
      TableName: process.env['CONTACT_TABLE_NAME'],
      Item: {
        id: { S: id },
        name: { S: args.name },
        email: { S: args.email },
        message: { S: args.message },
        createdAt: { S: createdAt },
        expiresAt: { N: expiresAt.toString() },
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

  logger.info('contact_submitted', { id });
}
