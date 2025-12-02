import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create sender
 * Creates a new sender account (email identity)

Behavior:
- Authenticates organization context.
- Validates sender email, settings and existence.
- Checks for limits and duplicates.
- Creates new sender.
- Persists and returns result or errors.
 */
export async function createSender(this: IExecuteFunctions, index: number) {
  const body: any = {};
  
  // Required fields
  body.email = this.getNodeParameter('email', index) as any;
  body.dailyLimit = this.getNodeParameter('dailyLimit', index) as any;
  body.customSmtpServer = this.getNodeParameter('customSmtpServer', index) as any;
  body.customSmtpPort = this.getNodeParameter('customSmtpPort', index) as any;
  body.customSmtpPass = this.getNodeParameter('customSmtpPass', index) as any;
  body.customImapServer = this.getNodeParameter('customImapServer', index) as any;
  body.customImapPort = this.getNodeParameter('customImapPort', index) as any;
  body.customImapPass = this.getNodeParameter('customImapPass', index) as any;
  
  // Optional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  if (additionalFields.folder !== undefined) body.folder = additionalFields.folder;
  if (additionalFields.fromName !== undefined) body.fromName = additionalFields.fromName;
  if (additionalFields.replyTo !== undefined) body.replyTo = additionalFields.replyTo;
  if (additionalFields.firstName !== undefined) body.firstName = additionalFields.firstName;
  if (additionalFields.lastName !== undefined) body.lastName = additionalFields.lastName;
  if (additionalFields.signature !== undefined) body.signature = additionalFields.signature;
  if (additionalFields.trackingDomain !== undefined) body.trackingDomain = additionalFields.trackingDomain;
  if (additionalFields.delayMin !== undefined) body.delayMin = additionalFields.delayMin;
  if (additionalFields.dailyLimitIncrease !== undefined) body.dailyLimitIncrease = additionalFields.dailyLimitIncrease;
  if (additionalFields.dailyLimitIncreaseToMax !== undefined) body.dailyLimitIncreaseToMax = additionalFields.dailyLimitIncreaseToMax;
  if (additionalFields.dailyLimitIncreasePercent !== undefined) body.dailyLimitIncreasePercent = additionalFields.dailyLimitIncreasePercent;
  if (additionalFields.warmup !== undefined) body.warmup = additionalFields.warmup;
  if (additionalFields.warmupDailyLimitIncrease !== undefined) body.warmupDailyLimitIncrease = additionalFields.warmupDailyLimitIncrease;
  if (additionalFields.warmupDailyLimitIncreaseToMax !== undefined) body.warmupDailyLimitIncreaseToMax = additionalFields.warmupDailyLimitIncreaseToMax;
  if (additionalFields.warmupDailyLimitIncreasePercent !== undefined) body.warmupDailyLimitIncreasePercent = additionalFields.warmupDailyLimitIncreasePercent;
  if (additionalFields.warmupDailyLimit !== undefined) body.warmupDailyLimit = additionalFields.warmupDailyLimit;
  if (additionalFields.warmupReplyPercent !== undefined) body.warmupReplyPercent = additionalFields.warmupReplyPercent;
  if (additionalFields.warmupSkipWeekends !== undefined) body.warmupSkipWeekends = additionalFields.warmupSkipWeekends;
  if (additionalFields.customWarmupTag !== undefined) body.customWarmupTag = additionalFields.customWarmupTag;
  if (additionalFields.customSmtpUsername !== undefined) body.customSmtpUsername = additionalFields.customSmtpUsername;
  if (additionalFields.customImapUsername !== undefined) body.customImapUsername = additionalFields.customImapUsername;
  if (additionalFields.senderCustom1 !== undefined) body.senderCustom1 = additionalFields.senderCustom1;
  if (additionalFields.senderCustom2 !== undefined) body.senderCustom2 = additionalFields.senderCustom2;
  if (additionalFields.senderCustom3 !== undefined) body.senderCustom3 = additionalFields.senderCustom3;
  if (additionalFields.senderCustom4 !== undefined) body.senderCustom4 = additionalFields.senderCustom4;
  if (additionalFields.senderCustom5 !== undefined) body.senderCustom5 = additionalFields.senderCustom5;
  if (additionalFields.senderCustom6 !== undefined) body.senderCustom6 = additionalFields.senderCustom6;
  if (additionalFields.senderCustom7 !== undefined) body.senderCustom7 = additionalFields.senderCustom7;
  if (additionalFields.senderCustom8 !== undefined) body.senderCustom8 = additionalFields.senderCustom8;
  if (additionalFields.senderCustom9 !== undefined) body.senderCustom9 = additionalFields.senderCustom9;
  if (additionalFields.senderCustom10 !== undefined) body.senderCustom10 = additionalFields.senderCustom10;
  
  const response = await apiRequest.call(this, 'POST', '/api/v2/senders', body);
  return response;
}
