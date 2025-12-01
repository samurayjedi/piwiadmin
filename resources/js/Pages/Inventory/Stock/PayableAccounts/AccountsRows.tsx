import React from 'react';
import _ from 'lodash';
import CollapsibleRows from '@/src/lib/piwi/animated/CollapsibleRows';
import { defaultCollapseCallback } from '@/src/lib/piwi/animated/CollapsibleRows/CollapseButton';
import usePayableAccounts from './hooks';
import Cells from './Cells';
import DetailsPager from './DetailsPager';

function AccountsRows({ onPay }: { onPay: (id: number) => void }) {
  const payable_accounts = usePayableAccounts();

  return (
    <CollapsibleRows colSpan={7}>
      {(activeIndex, setActiveIndex) =>
        payable_accounts.map((account, i) => [
          <Cells
            {...account}
            active={activeIndex === i}
            onRequestCollapse={() => defaultCollapseCallback(i, setActiveIndex)}
          />,
          <DetailsPager {...account} onPay={onPay} />,
        ])
      }
    </CollapsibleRows>
  );
}

export default React.memo(AccountsRows, _.isEqual);
