import React, { useEffect, useState } from 'react';

import { IPeriod } from '../types/interfaces';

import Balance from './Balance';
import PersistWallets from '../services/PersistWallets';

interface Props {
  contextPersistance: PersistWallets
  period: IPeriod | null,
  id: string,
  name: string,
}

function Wallet({contextPersistance, period, id, name}: Props) {

  const [walletName, setWalletName] = useState(name);

  useEffect(() => {
    contextPersistance.changeWalletName(id, walletName);
  }, [walletName]);

  return (
    <div key={id} className="Wallet">
      <input type="text" value={walletName} placeholder="Nome da Carteira" onChange={(e) => setWalletName(e.target.value)} />
      <Balance period={period} walletId={id}/>
    </div>
  );
}

export default Wallet;
