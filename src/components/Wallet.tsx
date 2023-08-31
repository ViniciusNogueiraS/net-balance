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
  index: number,
  name: string,
  matiz: number,
  updateWallets: Function,
  scrollCursor: number
}

function Wallet({contextPersistance, period, id, index, name, matiz, updateWallets, scrollCursor}: Props) {

  const [walletName, setWalletName] = useState(name);
  const [selected, setSelected] = useState(false);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    contextPersistance.changeWalletName(id, walletName);
  }, [walletName]);

  useEffect(() => {
    let n = parseInt((scrollCursor / 20).toFixed(0));

    if (n == index) setSelected(true);
    else setSelected(false);

  }, [scrollCursor]);

  function removeWallet(id: string) {
    contextPersistance.removeWallet(id);
    updateWallets();
  }

  return (
    <div key={id} className={`Wallet ${(selected ? 'Selected' : '')} ${(toggle ? 'Op' : 'Cl')}`}>
      <div className="TopBar">
        {!toggle && <input type="text" value={walletName} placeholder="Nome da Carteira" onChange={(e) => setWalletName(e.target.value)} />}
        {!toggle && <button className="Remove" onClick={() => removeWallet(id)}>🗑</button>}
        {toggle && <button className="Toggle" onClick={() => setToggle(false)}>↗</button>}
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
