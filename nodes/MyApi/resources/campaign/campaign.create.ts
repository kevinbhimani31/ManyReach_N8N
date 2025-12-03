import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

/**
 * Create campaign
 * Creates a new campaign associated with the authenticated organization.
            
Behavior:
- Extracts and validates API key (header/query).
- Authenticates org using API key.
- Checks campaign limit for the org variant (normal/PowerMode).
- Builds and saves the new campaign.
- Automatically creates a default sequence ('1') with onboarding if relevant.
- Returns details of the created campaign, or appropriate error.
 */
export async function createCampaign(this: IExecuteFunctions, index: number) {
  const body: any = {};
  
  // Required fields
  body.name = this.getNodeParameter('name', index) as any;
  
  // Optional fields
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;
  if (additionalFields.folderId !== undefined) body.folderId = additionalFields.folderId;
  if (additionalFields.description !== undefined) body.description = additionalFields.description;
  if (additionalFields.fromEmails !== undefined) body.fromEmails = additionalFields.fromEmails;
  if (additionalFields.fromName !== undefined) body.fromName = additionalFields.fromName;
  if (additionalFields.replyToEmail !== undefined) body.replyToEmail = additionalFields.replyToEmail;
  if (additionalFields.subject !== undefined) body.subject = additionalFields.subject;
  if (additionalFields.body !== undefined) body.body = additionalFields.body;
  if (additionalFields.textOnlyEmails !== undefined) body.textOnlyEmails = additionalFields.textOnlyEmails;
  if (additionalFields.ccEmails !== undefined) body.ccEmails = additionalFields.ccEmails;
  if (additionalFields.bccEmails !== undefined) body.bccEmails = additionalFields.bccEmails;
  if (additionalFields.replyBccEmails !== undefined) body.replyBccEmails = additionalFields.replyBccEmails;
  if (additionalFields.replyCcEmails !== undefined) body.replyCcEmails = additionalFields.replyCcEmails;
  if (additionalFields.sendUnsubscribeListHeader !== undefined) body.sendUnsubscribeListHeader = additionalFields.sendUnsubscribeListHeader;
  if (additionalFields.deactivateIfMissingPlaceholder !== undefined) body.deactivateIfMissingPlaceholder = additionalFields.deactivateIfMissingPlaceholder;
  if (additionalFields.stopCoworkersOnReply !== undefined) body.stopCoworkersOnReply = additionalFields.stopCoworkersOnReply;
  if (additionalFields.trackOpens !== undefined) body.trackOpens = additionalFields.trackOpens;
  if (additionalFields.trackClicks !== undefined) body.trackClicks = additionalFields.trackClicks;
  if (additionalFields.prospectValue !== undefined) body.prospectValue = additionalFields.prospectValue;
  if (additionalFields.dailyLimit !== undefined) body.dailyLimit = additionalFields.dailyLimit;
  if (additionalFields.dailyLimitPer !== undefined) body.dailyLimitPer = additionalFields.dailyLimitPer;
  if (additionalFields.dailyLimitIncrease !== undefined) body.dailyLimitIncrease = additionalFields.dailyLimitIncrease;
  if (additionalFields.dailyLimitIncreaseToMax !== undefined) body.dailyLimitIncreaseToMax = additionalFields.dailyLimitIncreaseToMax;
  if (additionalFields.dailyLimitIncreasePercent !== undefined) body.dailyLimitIncreasePercent = additionalFields.dailyLimitIncreasePercent;
  if (additionalFields.dailyLimitOnDate !== undefined) body.dailyLimitOnDate = additionalFields.dailyLimitOnDate;
  if (additionalFields.dailyLimitPrioritize !== undefined) body.dailyLimitPrioritize = additionalFields.dailyLimitPrioritize;
  if (additionalFields.dailyLimitInitial !== undefined) body.dailyLimitInitial = additionalFields.dailyLimitInitial;
  if (additionalFields.dailyLimitInitialEnabled !== undefined) body.dailyLimitInitialEnabled = additionalFields.dailyLimitInitialEnabled;
  if (additionalFields.dailyLimitWhichEmailsCount !== undefined) body.dailyLimitWhichEmailsCount = additionalFields.dailyLimitWhichEmailsCount;
  if (additionalFields.scheduleSending !== undefined) body.scheduleSending = additionalFields.scheduleSending;
  if (additionalFields.scheduleTimeZone !== undefined) body.scheduleTimeZone = additionalFields.scheduleTimeZone;
  if (additionalFields.useProspectsTimeZone !== undefined) body.useProspectsTimeZone = additionalFields.useProspectsTimeZone;
  if (additionalFields.scheduleSendOnDate !== undefined) body.scheduleSendOnDate = additionalFields.scheduleSendOnDate;
  if (additionalFields.scheduleSendOnDateMinutes !== undefined) body.scheduleSendOnDateMinutes = additionalFields.scheduleSendOnDateMinutes;
  if (additionalFields.scheduleSendOnDateEnabled !== undefined) body.scheduleSendOnDateEnabled = additionalFields.scheduleSendOnDateEnabled;
  if (additionalFields.scheduleSendOnDateHours !== undefined) body.scheduleSendOnDateHours = additionalFields.scheduleSendOnDateHours;
  if (additionalFields.delayMinMinutes !== undefined) body.delayMinMinutes = additionalFields.delayMinMinutes;
  if (additionalFields.espMatchType !== undefined) body.espMatchType = additionalFields.espMatchType;
  if (additionalFields.espMatchEnabled !== undefined) body.espMatchEnabled = additionalFields.espMatchEnabled;
  if (additionalFields.espLimitEnabled !== undefined) body.espLimitEnabled = additionalFields.espLimitEnabled;
  if (additionalFields.espLimitToMicrosoft !== undefined) body.espLimitToMicrosoft = additionalFields.espLimitToMicrosoft;
  if (additionalFields.espLimitToGoogle !== undefined) body.espLimitToGoogle = additionalFields.espLimitToGoogle;
  if (additionalFields.espLimitToOther !== undefined) body.espLimitToOther = additionalFields.espLimitToOther;
  if (additionalFields.sendMonAfter !== undefined) body.sendMonAfter = additionalFields.sendMonAfter;
  if (additionalFields.sendMonBefore !== undefined) body.sendMonBefore = additionalFields.sendMonBefore;
  if (additionalFields.sendMon !== undefined) body.sendMon = additionalFields.sendMon;
  if (additionalFields.sendTueAfter !== undefined) body.sendTueAfter = additionalFields.sendTueAfter;
  if (additionalFields.sendTueBefore !== undefined) body.sendTueBefore = additionalFields.sendTueBefore;
  if (additionalFields.sendTue !== undefined) body.sendTue = additionalFields.sendTue;
  if (additionalFields.sendWedAfter !== undefined) body.sendWedAfter = additionalFields.sendWedAfter;
  if (additionalFields.sendWedBefore !== undefined) body.sendWedBefore = additionalFields.sendWedBefore;
  if (additionalFields.sendWed !== undefined) body.sendWed = additionalFields.sendWed;
  if (additionalFields.sendThuAfter !== undefined) body.sendThuAfter = additionalFields.sendThuAfter;
  if (additionalFields.sendThuBefore !== undefined) body.sendThuBefore = additionalFields.sendThuBefore;
  if (additionalFields.sendThu !== undefined) body.sendThu = additionalFields.sendThu;
  if (additionalFields.sendFriAfter !== undefined) body.sendFriAfter = additionalFields.sendFriAfter;
  if (additionalFields.sendFriBefore !== undefined) body.sendFriBefore = additionalFields.sendFriBefore;
  if (additionalFields.sendFri !== undefined) body.sendFri = additionalFields.sendFri;
  if (additionalFields.sendSatAfter !== undefined) body.sendSatAfter = additionalFields.sendSatAfter;
  if (additionalFields.sendSatBefore !== undefined) body.sendSatBefore = additionalFields.sendSatBefore;
  if (additionalFields.sendSat !== undefined) body.sendSat = additionalFields.sendSat;
  if (additionalFields.sendSunAfter !== undefined) body.sendSunAfter = additionalFields.sendSunAfter;
  if (additionalFields.sendSunBefore !== undefined) body.sendSunBefore = additionalFields.sendSunBefore;
  if (additionalFields.sendSun !== undefined) body.sendSun = additionalFields.sendSun;
  
  const response = await apiRequest.call(this, 'POST', '/api/v2/campaigns', body);
  return response;
}
