import React, { useEffect, useState } from 'react';

import { IPeriod } from '../types/interfaces';

import Balance from './Balance';
import PersistWallets from '../services/PersistWallets';

import background1 from '../assets/images/wallet-opened.png';
import background2 from '../assets/images/wallet-closed.png';

interface Props {
  contextPersistance: PersistWallets
  period: IPeriod | null,
  id: string,
  name: string,
  matiz: number,
  updateWallets: Function
}

function Wallet({contextPersistance, period, id, name, matiz, updateWallets}: Props) {

  const [walletName, setWalletName] = useState(name);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    contextPersistance.changeWalletName(id, walletName);
  }, [walletName]);

  function removeWallet(id: string) {
    contextPersistance.removeWallet(id);
    updateWallets();
  }

  return (
    <div key={id} className={`Wallet ${(toggle ? 'Op' : 'Cl')}`}>
      <div className="TopBar">
        <input type="text" value={walletName} placeholder="Nome da Carteira" onChange={(e) => setWalletName(e.target.value)} />
        <button onClick={() => removeWallet(id)}>X</button>
        {toggle && <button onClick={() => setToggle(false)}>↓</button>}
      </div>
      {toggle ? (
        <>
          <Balance period={period} walletId={id}/>
          <img className="BackgroundOp" src={background1} style={{
            filter: `hue-rotate(${matiz}deg)`
          }}/>
        </>
      ) : (
        <>
          <img className="BackgroundCl" src={background2} style={{
            filter: `hue-rotate(${matiz}deg)`
          }}/>
          <button className="ButtonOp" onClick={() => setToggle(true)}></button>
        </>
      )}
    </div>
  );
}

export default Wallet;
