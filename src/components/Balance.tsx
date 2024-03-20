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
      <p className="BalanceValue">Saldo Anterior: &nbsp;
        <span style={{color: prevBalance < 0 ? '#444' : '#4279b3'}}>{currencyBRL.format(prevBalance)}</span>
      </p>
      <div className="Table">
        <div className="TableHead">
          <div className="Row">
            <div className="Cell">
              Data e Hora
            </div>
            <div className="Cell">
              Descrição
            </div>
            <div className="Cell">
              Tipo
            </div>
            <div className="Cell">
              Valor
            </div>
          </div>
        </div>
        <div className="TableBody">
          {entries.sort((a, b) => {

            if (a.date && b.date) {
              return a.date.getTime() - b.date.getTime();
            }else return -1;

          }).map((entry) => {
            if (editing === entry.id) {
              if (editEntry) {
                return (
                  <div className="Row" key={editEntry.id}>
                    <div className="Cell">
                      <DateTimePicker
                        onChange={(date: Date | null) => setEditEntry({...editEntry, date})}
                        value={editEntry.date}
                        format={"dd/MM/yyyy"}
                        clearIcon={null}
                      />
                    </div>
                    <div className="Cell">
                      <input
                        type="text"
                        placeholder="Descrição"
                        onChange={(e) => setEditEntry({...editEntry, description: e.target.value})}
                        value={editEntry.description}
                      />
                    </div>
                    <div className="Cell">
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
                    </div>
                    <div className="Cell">
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
                    </div>
                    <div className="Cell">
                      <button title="Confirmar" className="BtnOk" disabled={parseFloat(editEntry.value) <= 0} onClick={() => addEntry(editEntry.id)}>✔️</button>
                      <button title="Excluir" className="BtnRemove" onClick={() => removeEntry(entry.id)}>❌</button>
                    </div>
                  </div>
                )
              }
            } else {
              return (
                <div className="Row" key={entry.id}>
                  <div className="Cell">
                    <DateTimePicker
                      disabled
                      onChange={(date: Date | null) => setEditEntry({...entry, date})}
                      value={entry.date}
                      format={"dd/MM/yyyy"}
                      clearIcon={null}
                    />
                  </div>
                  <div className="Cell">
                    {entry.description}
                  </div>
                  <div className="Cell">
                    {entry.type}
                  </div>
                  <div className="Cell">
                    R$ {entry.value}
                  </div>
                  <div className="Cell">
                    <button title="Editar" className="BtnEdit" onClick={() => changeEntry(entry.id)}>✏️</button>
                  </div>
                </div>
              )
            }
          })}
          <div className="Row">
            <div className="Cell">
              <button title="Adicionar Registro" onClick={newEntry} className="BtnAdd">➕</button>
            </div>
          </div>
        </div>
      </div>
      <p className="BalanceValue">Saldo Atual:&nbsp;
        <span style={{color: currBalance < 0 ? '#444' : '#4279b3'}}>{currencyBRL.format(currBalance)}</span>
      </p>
    </div>
  );
}

export default Balance;
