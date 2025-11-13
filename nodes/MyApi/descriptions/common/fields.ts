import { INodeProperties } from 'n8n-workflow';

/**
 * Universal Field Builder
 */
export function createField(options: {
  displayName: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'options';
  default?: any;
  description?: string;
  resource?: string;
  operations?: string[];
  optionsList?: { name: string; value: string; description?: string }[];
   placeholder?: string;
}): INodeProperties {
  const field: INodeProperties = {
    displayName: options.displayName,
    name: options.name,
    type: options.type,
    default: options.default ?? getDefaultForType(options.type),
  };

  if (options.description) {
    field.description = options.description;
  }

  // If field uses dropdown options
  if (options.type === 'options' && options.optionsList) {
    field.options = options.optionsList;
  }

  if (options.placeholder) field.placeholder = options.placeholder;

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
    default: return '';
  }
}
