import { AppError } from '@/application/exceptions/App';

export class MissingFieldsError extends AppError {
  constructor(...fields: string[]) {
    const formatFields = (originalFields: string[]): string => {
      if (originalFields.length === 1) return `'${originalFields[0]}'`;

      const formattedFields = originalFields.map((field, index) => {
        if (index === originalFields.length - 2) return `'${field}' and `;
        if (index === originalFields.length - 1) return `'${field}'`;

        return `'${field}', `;
      }).join('');

      return formattedFields;
    };

    if (fields.length === 0) {
      throw new Error('Must have at least one field.');
    }

    const formattedFields = formatFields(fields);

    super({
      type: 'validation',
      name: 'MissingFieldsError',
      message: `Fields ${formattedFields} are required.`,
    });
  }
}
