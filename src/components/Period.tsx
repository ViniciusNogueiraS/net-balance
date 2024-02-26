import React, { useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';

import { IPeriod } from '../types/interfaces';


interface Props {
  period: IPeriod | null,
  setPeriod: Function
}

function Period({period, setPeriod}: Props) {

  const [togglePeriod, setTogglePeriod] = useState("Today");

  useEffect(() => {

    if (togglePeriod === "Today") {

      let init = new Date();
      let end = new Date();
      init.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      setPeriod({
        init,
        end
      });
    }

  }, [togglePeriod]);

  return (
    <div className="Period">
      <div style={{display: 'flex'}}>
        <label className="Period1">Periodo
          <input
            type="radio"
            name="Period"
            onChange={() => setTogglePeriod("Period")}
            value="Period"/>
        </label>
        <label className="Period2">Hoje
          <input
            type="radio"
            checked={togglePeriod === "Today"}
            name="Period" onChange={() => setTogglePeriod("Today")}
            value="Today"/>
        </label>
      </div><br/>

      <div className="PeriodSelect">
        {togglePeriod === "Period" ? (
          <>
            <label>Início<br/>
              <DateTimePicker
                onChange={(date: Date | null) => setPeriod({init: date, end: period?.end})}
                value={period?.init}
                disableClock={true}
                format={"dd/MM/yyyy"}
                clearIcon={null}
                maxDate={period?.end}
              />
            </label><br/>
            <label>Fim<br/>
              <DateTimePicker
                onChange={(date: Date | null) => setPeriod({init: period?.init, end: date})}
                value={period?.end}
                disableClock={true}
                format={"dd/MM/yyyy"}
                clearIcon={null}
                minDate={period?.init}
              />
            </label>
          </>
        ) : <></>}
      </div>

    </div>
  );
}

export default Period;
