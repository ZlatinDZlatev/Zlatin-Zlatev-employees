import React from 'react'
import './Table.css'

const EmployeeTable = ({columns, rows}) => {
    return(
        <table>
        <thead>
            <tr>
                {columns.map((column, index) => (
            <th key={index}>
              {column}
            </th>
          ))}
            </tr>    
        </thead>
        <tbody>
        {rows.map((row, rowIndex) => (
    <tr key={rowIndex}>
      {columns.map((column, colIndex) => (
        <td key={colIndex}>
          {row[column]}
        </td>
      ))}
    </tr>
  ))}

      </tbody>
      </table>
    )
}

export default EmployeeTable