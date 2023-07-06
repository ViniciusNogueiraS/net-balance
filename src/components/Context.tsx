import React, { useState } from 'react';
import Balance from './Balance';
import Period from './Period';

import { IPeriod } from '../types/interfaces';

function Context() {

  const [period, setPeriod] = useState<IPeriod | null>(null);

  return (
    <div className="Context">
      <Period period={period} setPeriod={setPeriod}/>
      <Balance period={period}/>
    </div>
  );
}

export default Context;
