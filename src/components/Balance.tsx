import React, { useState, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import CurrencyInput from 'react-currency-input-field';
import uuid from 'react-uuid';

import { IEntry, IPeriod } from '../types/interfaces';
import { Type } from '../types/enums';
import sumEntriesBefore from '../utils/sumEntriesBefore';
import sumEntriesBetween from '../utils/sumEntriesBetween';
import currencyBRL from '../utils/BRLcurrencyFormatter';
import PersistEntries from '../services/PersistEntries';

interface Props {
  period: IPeriod | null,
  walletId: string
}

function Balance({period, walletId}: Props) {

  const persistance = new PersistEntries(true, walletId);

  const [prevBalance, setPrevBalance] = useState(0);
  const [currBalance, setCurrBalance] = useState(0);

  const [entries, setEntries] = useState<IEntry[]>(persistance.getEntries() || []);
  const [editing, setEditing] = useState<string>("");
  const [editEntry, setEditEntry] = useState<IEntry | null>(null);  

  useEffect(() => {
    if (period) {
      loadEntries(period);
      loadBalances(period);
    }
  }, [period]);

  useEffect(() => {
    if (period) loadBalances(period);
  }, [editing]);

  function loadBalances(period: IPeriod) {

    let sumBefP = sumEntriesBefore(persistance, period, Type.ENTRADA);
    let sumBefN = sumEntriesBefore(persistance, period, Type.SAIDA);
    setPrevBalance(sumBefP - sumBefN);

    let sumBetP = sumEntriesBetween(persistance, period, Type.ENTRADA);
    let sumBetN = sumEntriesBetween(persistance, period, Type.SAIDA);
    setCurrBalance((sumBefP - sumBefN) + (sumBetP - sumBetN));
  }

  function loadEntries(period: IPeriod) {

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

  function addEntry(id: string) {
    if (!editEntry) return;

    if (persistance.getEntrieById(editEntry.id)) persistance.changeEntry(editEntry);
    else persistance.addEntry(editEntry);

    setEditEntry(null);
    setEditing("");
    if (period) loadEntries(period);
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
      value: "0.00"
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
            <td colSpan={4}>Saldo Anterior: {currencyBRL.format(prevBalance)}</td>
          </tr>
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
          {entries.sort((a, b) => {

            if (a.date && b.date) {
              return a.date.getTime() - b.date.getTime();
            }else return -1;

          }).map((entry) => {
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
                        decimalScale={2}
                        decimalsLimit={2}
                        decimalSeparator=","
                        groupSeparator="."
                        step={0.01}
                        prefix={"R$ "}
                        onValueChange={(value) => setEditEntry({...editEntry, value: value || "0.00"})}
                        value={editEntry.value}
                      />
                    </td>
                    <td>
                      <button disabled={parseFloat(editEntry.value) <= 0} onClick={() => addEntry(editEntry.id)}>OK</button>
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
            <td colSpan={5}>
              <button onClick={newEntry}>Novo Lançamento</button>
            </td>
          </tr>
          <tr>
            <td colSpan={4}>Saldo Atual: {currencyBRL.format(currBalance)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Balance;
