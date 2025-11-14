import { INodeProperties } from 'n8n-workflow';

/**
 * Universal Field Builder
 */
export function createField(options: {
  displayName: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'options' | 'resourceLocator' | 'multiOptions';
  default?: any;
  description?: string;
  resource?: string;
  required?: boolean;
  operations?: string[];
  required?: boolean;
  optionsList?: { name: string; value: string | number ; description?: string }[];
  placeholder?: string;
  typeOptions?: INodeProperties['typeOptions'];
  modes?: INodeProperties['modes'];
}): INodeProperties 

{
  const field: INodeProperties = {
    displayName: options.displayName,
    name: options.name,
    type: options.type,
    default: options.default ?? getDefaultForType(options.type),
    required: options.required ?? false,
  };

  if (options.description) {
    field.description = options.description;
  }

  // If field uses dropdown options
  if (options.type === 'options' && options.optionsList) {
    field.options = options.optionsList;
  }

  if (options.placeholder) field.placeholder = options.placeholder;
  if (options.typeOptions) field.typeOptions = options.typeOptions;
  if (options.type === 'resourceLocator' && options.modes) {
    field.modes = options.modes;
  }
  if( options.required) {
    field.required = options.required;
  }
  // Add dynamic displayOptions
  if (options.resource && options.operations) {
    field.displayOptions = {
      show: {
        resource: [options.resource],
        operation: options.operations,
      },
    };
  } else if (options.resource) {
    field.displayOptions = {
      show: { resource: [options.resource] },
    };
  }

  return field;
}

/**
 * Default value by field type
 */
function getDefaultForType(type: string) {
  switch (type) {
    case 'string': return '';
    case 'number': return 0;
    case 'boolean': return false;
    case 'json': return {};
    case 'resourceLocator': return { mode: 'list', value: '' };
    default: return '';
  }
}
