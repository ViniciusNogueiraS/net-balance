import React, { useState } from 'react';
import Period from './Period';
import Wallet from './Wallet';

import { IPeriod, IWallet } from '../types/interfaces';
import PersistWallets from '../services/PersistWallets';

import uuid from 'react-uuid';

function Context() {
  
  const contextPersistance = new PersistWallets(true);

  const [period, setPeriod] = useState<IPeriod | null>(null);
  const [wallets, setWallets] = useState<IWallet[]>(contextPersistance.getWallets() || []);

  function newWallet() {
    const w: IWallet = {
      id: uuid(),
      name: "",
      registers: []
    };

    contextPersistance.addWallet(w);
    setWallets(contextPersistance.getWallets() || []);
  }

  return (
    <div className="Context">
      <Period period={period} setPeriod={setPeriod}/>
      <div className="Wallets">
        {wallets.map(wallet => (
          <Wallet key={wallet.id} id={wallet.id} name={wallet.name} period={period} contextPersistance={contextPersistance}/>
        ))}
      </div>
      <button className="NewWallet" onClick={newWallet}>
        Nova Carteira
      </button>
    </div>
  );
}

export default Context;
