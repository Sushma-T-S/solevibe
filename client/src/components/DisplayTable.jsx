import React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'



const DisplayTable = ({ data, column }) => {
  const table = useReactTable({
    data,
    columns : column,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg border border-admin-border">
    <table className='w-full py-0 px-0 border-collapse'>
      <thead className='bg-admin-sidebar text-white'>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            <th className='p-4 text-left text-sm font-semibold rounded-tl-lg'>Sr.No</th>
            {headerGroup.headers.map(header => (
              <th key={header.id} className='border-l border-blue-400/30 p-4 text-left text-sm font-semibold whitespace-nowrap'>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row,index) => (
          <tr key={row.id} className='hover:bg-blue-50 transition-colors'>
            <td className='border-t border-admin-border px-4 py-3 text-sm font-medium text-admin-text-muted'>{index+1}</td>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className='border-t border-l border-admin-border px-4 py-3 whitespace-nowrap text-sm text-admin-text'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div className="h-4" />
  </div>
  )
}

export default DisplayTable
