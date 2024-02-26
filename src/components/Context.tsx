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
  const [scrollCursor, setScrollCursor] = useState(0);

  function newWallet() {

    if (wallets.length >= 10) {
      alert("Limite de Carteiras atingido.");
      return;
    }

    const w: IWallet = {
      id: uuid(),
      name: "",
      matiz: Math.floor(Math.random() * 360),
      registers: []
    };

    contextPersistance.addWallet(w);
    setWallets(contextPersistance.getWallets() || []);
  }

  function scrolling(e: React.UIEvent<HTMLDivElement, UIEvent>) {

    let el = e.nativeEvent.target;
    if (el instanceof Element) {
      
      let max = wallets.length * 46.5;
      let str = ((el.scrollTop / max) * 100 ).toFixed(0);
      setScrollCursor(parseInt(str));
    }
  }

  return (
    <div className="Context">
      <Period period={period} setPeriod={setPeriod}/>
      <div className="Wallets" onScroll={(e) => scrolling(e)}>
        {wallets.map((wallet, index) => (
          <Wallet
            key={wallet.id}
            id={wallet.id}
            index={index}
            name={wallet.name}
            matiz={wallet.matiz}
            period={period}
            contextPersistance={contextPersistance}
            updateWallets={() => setWallets(contextPersistance.getWallets() || [])}
            scrollCursor={scrollCursor}
          />
        ))}
      </div>
      <button className="NewWallet" onClick={newWallet}>
        Nova Carteira 👝
      </button>
    </div>
  );
}

export default Context;
