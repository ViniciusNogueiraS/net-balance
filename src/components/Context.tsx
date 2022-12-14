import React, { useState } from 'react';
import Balance from './Balance';
import Period from './Period';

interface IUser {
  id: string,
  email: string,
  password: string,
  nickname: string
}

export interface IPeriod {
  init: Date | null,
  end: Date | null
}

function Context() {

  const [user, setUser] = useState<IUser | null>(null);
  const [period, setPeriod] = useState<IPeriod | null>(null);

  return (
    <div className="Context">
      <Period period={period} setPeriod={setPeriod}/>
      <Balance period={period}/>
    </div>
  );
}

export default Context;
