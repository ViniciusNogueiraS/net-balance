import React, { useEffect, useState } from 'react';

import { IPeriod } from '../types/interfaces';

import Balance from './Balance';
import PersistWallets from '../services/PersistWallets';

interface Props {
  contextPersistance: PersistWallets
  period: IPeriod | null,
  id: string,
  name: string,
  updateWallets: Function
}

function Wallet({contextPersistance, period, id, name, updateWallets}: Props) {

  const [walletName, setWalletName] = useState(name);

  useEffect(() => {
    contextPersistance.changeWalletName(id, walletName);
  }, [walletName]);

  function removeWallet(id: string) {
    contextPersistance.removeWallet(id);
    updateWallets();
  }

  return (
    <div key={id} className="Wallet">
      <input type="text" value={walletName} placeholder="Nome da Carteira" onChange={(e) => setWalletName(e.target.value)} />
      <button onClick={() => removeWallet(id)}>X</button>
      <Balance period={period} walletId={id}/>
    </div>
  );
}

export default Wallet;
