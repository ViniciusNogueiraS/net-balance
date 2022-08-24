import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
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

export default App;
