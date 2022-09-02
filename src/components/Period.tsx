import React, { useEffect, useState } from 'react';
import { IPeriod } from './Context';
import ModernDatepicker from 'react-modern-datepicker';

interface Props {
  period: IPeriod | null,
  setPeriod: Function
}

function Period({period, setPeriod}: Props) {

  const [togglePeriod, setTogglePeriod] = useState("Period");

  useEffect(() => {

    if (togglePeriod === "Today") {
      setPeriod({
        init: new Date(),
        end: new Date()
      });
    }

  }, [togglePeriod]);

  return (
    <div className="Period">
      <div>
        <label>Period
          <input type="radio" name="Period" onChange={() => setTogglePeriod("Period")} value="Period"/>
        </label>
        <label>Today
          <input type="radio" name="Period" onChange={() => setTogglePeriod("Today")} value="Today"/>
        </label>
      </div>

      <div>
        {togglePeriod === "Period" ? (
          <>
            <ModernDatepicker
              date={period?.init}
              format={'DD-MM-YYYY'}
              showBorder
              onChange={(date: Date | null) => setPeriod({init: date, end: period?.end})}
              placeholder={'Select a date to Init'}
            />
            <ModernDatepicker
              date={period?.end}
              format={'DD-MM-YYYY'}
              showBorder
              onChange={(date: Date | null) => setPeriod({init: period?.init, end: date})}
              placeholder={'Select a date to End'}
            />
          </>
        ) : (
          <span></span>
        )}
      </div>

    </div>
  );
}

export default Period;
