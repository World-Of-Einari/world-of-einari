import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { randomUUID } from 'crypto';
import { logger } from '../core/logger';
import { validateContactRequest } from '../utilities/validate-contact-request';
import { config } from '../config';
import { ContactRequest } from '../utilities/schemas';

/**
 * Persists a contact request to DynamoDB and publishes
 * an SNS notification to the configured topic.
 * In local development, logs to console instead of hitting AWS.
 */
export async function submitContactRequest(args: ContactRequest): Promise<void> {
  const { name, email, message } = validateContactRequest(args);

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  if (process.env['NODE_ENV'] !== 'production') {
    logger.info('[submitContactRequest] local dev — skipping DynamoDB/SNS');
    logger.info(`[submitContactRequest] id: ${id}`);
    logger.info(`[submitContactRequest] name: ${name}`);
    logger.info(`[submitContactRequest] email: ${email}`);
    logger.info(`[submitContactRequest] message: ${message}`);
    logger.info(`[submitContactRequest] createdAt: ${createdAt}`);
    return;
  }

  const dynamo = new DynamoDBClient({});
  const sns = new SNSClient({});

  const expiresAt = Math.floor(Date.now() / 1000) + config.contact.ttlDays * 24 * 60 * 60;

  await dynamo.send(
    new PutItemCommand({
      TableName: process.env['CONTACT_TABLE_NAME'],
      Item: {
        id: { S: id },
        name: { S: name },
        email: { S: email },
        message: { S: message },
        createdAt: { S: createdAt },
        expiresAt: { N: expiresAt.toString() },
      },
    }),
  );

  await sns.send(
    new PublishCommand({
      TopicArn: process.env['CONTACT_SNS_TOPIC_ARN'],
      Subject: `New contact request from ${name}`,
      Message: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Message: ${message}`,
        `Received: ${createdAt}`,
      ].join('\n'),
    }),
  );

  logger.info('contact_submitted', { id });
}
