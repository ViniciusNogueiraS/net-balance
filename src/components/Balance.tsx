import React, { useState } from 'react';
import { IPeriod } from './Context';

enum Type {
  ENTRADA = 'Entrada',
  SAIDA = 'Saida'
}

interface IEntry {
  date: Date,
  description: string,
  tipo: Type,
  value: number
}

interface Props {
  period: IPeriod | null
}

function Balance({period}: Props) {

  const [entries, setEntries] = useState<IEntry[]>([]);

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
          <tr>
            <td>
              24/08/2022 - 12:20
            </td>
            <td>
              <input type="text"/>
            </td>
            <td>
              <select name="" id="">
                <option selected value="Entrada">Entrada</option>
                <option value="Saída">Saída</option>
              </select>
            </td>
            <td>
              R$ 25,00
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Balance;
