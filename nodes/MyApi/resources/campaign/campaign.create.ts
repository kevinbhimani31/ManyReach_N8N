import { IExecuteFunctions } from 'n8n-workflow';
import { apiRequest } from '../../helpers/apiRequest';

export async function createCampaign(this: IExecuteFunctions, index: number) {

	// -----------------------------------------
	// REQUIRED FIELDS
	// -----------------------------------------
	const campaignName = this.getNodeParameter('campaignName', index) as string;
	const campaignDescription = this.getNodeParameter('campaignDescription', index, '') as string;

	if (!campaignName || campaignName.trim() === '') {
		throw new Error('Campaign Name is required');
	}

	if (campaignName.length < 3) {
		throw new Error('Campaign Name must be at least 3 characters long');
	}

	// Base object
	const body: any = {
		name: campaignName.trim(),
	};

	if (campaignDescription && campaignDescription.trim() !== '') {
		body.description = campaignDescription.trim();
	}

	// -----------------------------------------
	// TOP-LEVEL FIELDS (VERY IMPORTANT)
	// -----------------------------------------
	const topLevelFields = [
		'fromEmail',
		'fromName',
		'subject',
		'body',
		'timezone',
		'dailyLimitIncreasePercent',
	];

	topLevelFields.forEach((field) => {
		const val = this.getNodeParameter(field, index, undefined);
		if (val !== undefined && val !== '') {
			body[field] = val;
		}
	});

	// -----------------------------------------
	// DAYS SELECTION
	// -----------------------------------------
	const selectedDays = this.getNodeParameter('daysOfWeek', index, []) as string[];

	// Mapping dropdown → API field
	const dayMap: Record<string, string> = {
		mon: 'sendMon',
		tue: 'sendTue',
		wed: 'sendWed',
		thu: 'sendThu',
		fri: 'sendFri',
		sat: 'sendSat',
		sun: 'sendSun',
	};

	// Default all days false
	for (const key of Object.values(dayMap)) {
		body[key] = false;
	}

	// Set selected days to true
	selectedDays.forEach((day) => {
		const apiField = dayMap[day];
		if (apiField) {
			body[apiField] = true;
		}
	});

	// -----------------------------------------
	// ADDITIONAL FIELDS
	// -----------------------------------------
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as any;

	const simpleFields = [
		'ccEmails',
		'bccEmails',
		'replyToEmail',
		'replyCcEmails',
		'replyBccEmails',
		'dailyLimit',
		'dailyLimitPer',
		'dailyLimitIncrease',
		'dailyLimitIncreaseToMax',
		'trackOpens',
		'trackClicks',
	];

	simpleFields.forEach((field) => {
		if (additionalFields[field] !== undefined && additionalFields[field] !== '') {
			body[field] = additionalFields[field];
		}
	});

	// -----------------------------------------
	// TIME FIELDS FOR EACH DAY
	// -----------------------------------------
	const timeFields = [
		'sendMonAfter', 'sendMonBefore',
		'sendTueAfter', 'sendTueBefore',
		'sendWedAfter', 'sendWedBefore',
		'sendThuAfter', 'sendThuBefore',
		'sendFriAfter', 'sendFriBefore',
		'sendSatAfter', 'sendSatBefore',
		'sendSunAfter', 'sendSunBefore',
	];

	timeFields.forEach((field) => {
		if (additionalFields[field] !== undefined && additionalFields[field] !== '') {
			body[field] = additionalFields[field];
		}
	});

	// -----------------------------------------
	// CLEAN EMPTY STRINGS
	// -----------------------------------------
	Object.keys(body).forEach((key) => {
		if (body[key] === '') {
			body[key] = null;
		}
	});

	// -----------------------------------------
	// SEND REQUEST
	// -----------------------------------------
	const response = await apiRequest.call(this, 'POST', '/campaigns', body);

	if (!response) {
		throw new Error('Failed to create campaign: Empty API response');
	}

	return response;
}
