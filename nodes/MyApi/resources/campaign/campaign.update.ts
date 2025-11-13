import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';
import { ensureGuid, ensureId } from '../../helpers/validation';

export interface UpdateCampaignRequest {
  FolderId?: number;
  Active?: boolean;
  Name?: string;
  Description?: string;
  FromEmail?: string;
  FromName?: string;
  ReplyToEmail?: string;
  Subject?: string;
  Body?: string;
  TextOnlyEmails?: boolean;
  CcEmails?: string;
  BccEmails?: string;
  ReplyBccEmails?: string;
  ReplyCcEmails?: string;
  SendUnsubscribeListHeader?: boolean;
  DeactivateIfMissingPlaceholder?: boolean;
  StopCoworkersOnReply?: boolean;
  TrackOpens?: boolean;
  TrackClicks?: boolean;
  ProspectValue?: number;
  DailyLimit?: number;
  DailyLimitPer?: string;
  DailyLimitIncrease?: boolean;
  DailyLimitIncreaseToMax?: number;
  DailyLimitIncreasePercent?: number;
  DailyLimitOnDate?: string;
  DailyLimitPrioritize?: string;
  DailyLimitInitial?: number;
  DailyLimitInitialEnabled?: boolean;
  DailyLimitWhichEmailsCount?: string;
  ScheduleSending?: boolean;
  ScheduleTimeZone?: string;
  ScheduleSendOnDate?: string;
  ScheduleSendOnDateMinutes?: number;
  ScheduleSendOnDateEnabled?: boolean;
  ScheduleSendOnDateHours?: number;
  DelayMinMinutes?: number;
  EspMatchType?: number;
  EspMatchEnabled?: boolean;
  EspLimitEnabled?: boolean;
  EspLimitToMicrosoft?: boolean;
  EspLimitToGoogle?: boolean;
  EspLimitToOther?: boolean;
  SendMonAfter?: number;
  SendMonBefore?: number;
  SendMon?: boolean;
  SendTueAfter?: number;
  SendTueBefore?: number;
  SendTue?: boolean;
  SendWedAfter?: number;
  SendWedBefore?: number;
  SendWed?: boolean;
  SendThuAfter?: number;
  SendThuBefore?: number;
  SendThu?: boolean;
  SendFriAfter?: number;
  SendFriBefore?: number;
  SendFri?: boolean;
  SendSatAfter?: number;
  SendSatBefore?: number;
  SendSat?: boolean;
  SendSunAfter?: number;
  SendSunBefore?: number;
  SendSun?: boolean;
}

export async function updateCampaign(this: IExecuteFunctions, index: number) {
  const rawCampaignId = this.getNodeParameter('campaignId', index) as string | number;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as UpdateCampaignRequest;

  const campaignId = normalizeCampaignId(rawCampaignId);

  const requestBody: UpdateCampaignRequest = {};
  for (const [key, value] of Object.entries(updateFields)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value === 'string' && value.trim() === '') {
      continue;
    }
    requestBody[key as keyof UpdateCampaignRequest] = value as never;
  }

  if (Object.keys(requestBody).length === 0) {
    throw new Error('Please provide at least one field to update.');
  }

  const response = await apiRequest.call(this, 'PATCH', `/campaigns/${campaignId}`, requestBody);

  return response;
}

function normalizeCampaignId(id: string | number): string {
  if (typeof id === 'number') {
    ensureId(id);
    return id.toString();
  }

  const trimmedId = id.trim();
  if (!trimmedId) {
    throw new Error('Campaign ID must be provided');
  }

  if (/^\d+$/.test(trimmedId)) {
    ensureId(Number(trimmedId));
  } else {
    ensureGuid(trimmedId);
  }

  return trimmedId;
}
