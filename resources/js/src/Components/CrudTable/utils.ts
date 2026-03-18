import _ from 'lodash';
import { CrudTableProps } from './types';

export function initialize(
  fields: CrudTableProps['fields'],
  records: Record<string, any> | undefined = undefined,
) {
  const hash: Record<string, any> = {};
  _.forEach(fields, (fieldDescription) => {
    const [name, , f] = fieldDescription;
    if (f && f.type === 'select' && f.props) {
      const props = typeof f.props === 'function' ? f.props('add') : f.props;
      if (props.multiple) {
        if (records) {
          hash[name] = JSON.parse(records[name]);
        } else {
          hash[name] = [];
        }
      }
    }
  });

  return hash;
}
