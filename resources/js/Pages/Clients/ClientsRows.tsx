import { useState } from 'react';
import { useForm } from 'react-final-form';
import TableRowCollapsible, {
  defaultCollapseCallback,
} from '@/src/lib/piwi/animated/TableRowCollapsible';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clientAction } from '@/store/client';
import { useClients } from './hooks';
import ClientCells from './ClientCells';
import ClientSales from './ClientSales';

export default function ClientsRows() {
  const form = useForm();
  const clients = useClients();
  const dispatch = useAppDispatch();
  const id = useAppSelector((state) => state.client.id);
  const action = useAppSelector((state) => state.client.action);
  const [activeIndex, setActiveIndex] = useState(-1);

  return clients.map((client, i) => (
    <TableRowCollapsible
      key={`client-rows-${client.id}`}
      colSpan={7}
      collapsed={activeIndex === i}
      collapsedChildren={<ClientSales {...client} />}
    >
      <ClientCells
        key={`client-row-${client.id}`}
        {...client}
        active={activeIndex === i}
        editing={id === client.id && action === 'edit'}
        onEdit={(cId) => {
          setActiveIndex(-1);
          dispatch(clientAction([cId, 'edit']));
        }}
        onDelete={(cId) => dispatch(clientAction([cId, 'delete']))}
        onCancel={() => {
          form.setConfig('initialValues', {});
          form.reset();
          dispatch(clientAction([-1, undefined]));
        }}
        onRequestCollapse={() => defaultCollapseCallback(i, setActiveIndex)}
      />
    </TableRowCollapsible>
  ));
}
