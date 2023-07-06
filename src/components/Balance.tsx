import React, { useState, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import CurrencyInput from 'react-currency-input-field';
import uuid from 'react-uuid';

import { IEntry, IPeriod } from '../types/interfaces';
import { Type } from '../types/enums';
import Persist from '../services/Persist';

interface Props {
  period: IPeriod | null
}

function Balance({period}: Props) {

  const persistance = new Persist(true);

  const [entries, setEntries] = useState<IEntry[]>(persistance.getEntries() || []);
  const [editing, setEditing] = useState<string>("");
  const [editEntry, setEditEntry] = useState<IEntry | null>(null);

  useEffect(() => {
    if (period) {

      let arr = persistance.getEntries() || [];
      arr = arr.filter(e => {
        if (e.date && period.init && period.end) {
          let dateEntry = e.date.getTime();
          let periodInit = period.init.getTime();
          let periodEnd = period.end.getTime();

          return (dateEntry >= periodInit && dateEntry <= periodEnd);
        }else return false;
      });

      setEntries(arr);
    }
  }, [period]);

  function addEntry(index: number) {
    if (!editEntry) return;
    
    let arr = entries;
    arr[index] = editEntry;

    setEntries(arr);
    setEditEntry(null);
    setEditing("");
    persistance.addEntry(editEntry);
  }

  function removeEntry(id: string) {
    setEditEntry(null);
    setEditing("");

    let arr = entries.filter(e => e.id !== id);
    setEntries(arr);
    persistance.removeEntry(id);
  }

  function changeEntry(id: string) {
    let entry = entries.filter(e => e.id === id)[0];

    setEditEntry(entry);
    setEditing(id);
  }

  function newEntry() {
    if (editEntry) return;

    let date = new Date();
    date.setHours(0, 0, 0, 0);

    let entry: IEntry = {
      id: uuid(),
      date,
      description: "",
      type: Type.ENTRADA,
      value: "R$ 0.00"
    }

    let arr = entries;
    arr.push(entry);

    setEntries(arr);
    setEditEntry(entry);
    setEditing(entry.id);
  }

  return (
    <div className="Balance">
      <table border={1}>
        <thead>
          <tr>
            <td>
              Data e Hora
            </td>
            <td>
              Descrição
            </td>
            <td>
              Tipo
            </td>
            <td>
              Valor
            </td>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            if (editing === entry.id) {
              if (editEntry) {
                return (
                  <tr key={editEntry.id}>
                    <td>
                      <DateTimePicker
                        onChange={(date: Date | null) => setEditEntry({...editEntry, date})}
                        value={editEntry.date}
                        format={"dd/MM/yyyy"}
                        clearIcon={null}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Descrição"
                        onChange={(e) => setEditEntry({...editEntry, description: e.target.value})}
                        value={editEntry.description}
                      />
                    </td>
                    <td>
                      <select
                        onChange={(e) => setEditEntry(
                          {
                            ...editEntry,
                            type: (e.target.selectedIndex === 0 ? Type.ENTRADA : Type.SAIDA)
                          }
                        )}
                      >
                        <option selected={editEntry.type === Type.ENTRADA ? true : false} value={Type.ENTRADA}>Entrada</option>
                        <option selected={editEntry.type === Type.SAIDA ? true : false} value={Type.SAIDA}>Saída</option>
                      </select>
                    </td>
                    <td>
                      <CurrencyInput
                        placeholder={"Valor"}
                        defaultValue={0.00}
                        decimalsLimit={2}
                        decimalScale={2}
                        prefix={"R$ "}
                        decimalSeparator={","}
                        groupSeparator={"."}
                        onValueChange={(value) => setEditEntry({...editEntry, value: value || "0.00"})}
                      />
                    </td>
                    <td>
                      <button onClick={() => addEntry(index)}>OK</button>
                      <button onClick={() => removeEntry(entry.id)}>Excluir</button>
                    </td>
                  </tr>
                )
              }
            } else {
              return (
                <tr key={entry.id}>
                  <td>
                    <DateTimePicker
                      disabled
                      onChange={(date: Date | null) => setEditEntry({...entry, date})}
                      value={entry.date}
                      format={"dd/MM/yyyy"}
                      clearIcon={null}
                    />
                  </td>
                  <td>
                    {entry.description}
                  </td>
                  <td>
                    {entry.type}
                  </td>
                  <td>
                    R$ {entry.value}
                  </td>
                  <td>
                    <button onClick={() => changeEntry(entry.id)}>Editar</button>
                  </td>
                </tr>
              )
            }
          })}
          <tr>
            <td colSpan={4}>
              <button onClick={newEntry}>Novo Lançamento</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Balance;
