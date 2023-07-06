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
      <div>
        <label>Periodo
          <input
            type="radio"
            name="Period"
            onChange={() => setTogglePeriod("Period")}
            value="Period"/>
        </label>
        <label>Hoje
          <input
            type="radio"
            checked={togglePeriod === "Today"}
            name="Period" onChange={() => setTogglePeriod("Today")}
            value="Today"/>
        </label>
      </div>

      <div>
        {togglePeriod === "Period" ? (
          <>
            <label>Início
              <DateTimePicker
                onChange={(date: Date | null) => setPeriod({init: date, end: period?.end})}
                value={period?.init}
                disableClock={true}
                format={"dd/MM/yyyy"}
                clearIcon={null}
                maxDate={period?.end}
              />
            </label>
            <label>Fim
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
