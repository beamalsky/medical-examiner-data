import React from "react"

import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit'

const { ExportCSVButton } = CSVExport

const columns = [
  {
    dataField: 'community',
    text: 'Community Area',
    sort: true,
    style: {
      width: '50%'
    },
    sortCaret: (order, column) => {
      if (!order) return (<span>&nbsp;&nbsp;<font color="gray">↑↓</font></span>);
      else if (order === 'desc') return (<span>&nbsp;&nbsp;<font color="gray">↑</font>↓</span>);
      else if (order === 'asc') return (<span>&nbsp;&nbsp;↑<font color="gray">↓</font></span>);
      return null
    }
  },
  {
    dataField: 'per_capita',
    text: 'Deaths per 10,000 residents',
    sort: true,
    sortCaret: (order, column) => {
      if (!order) return (<span>&nbsp;&nbsp;<font color="gray">↑↓</font></span>);
      else if (order === 'desc') return (<span>&nbsp;&nbsp;<font color="gray">↑</font>↓</span>);
      else if (order === 'asc') return (<span>&nbsp;&nbsp;↑<font color="gray">↓</font></span>);
      return null;
    }
  },
  {
    dataField: 'total',
    text: 'Total Deaths',
    sort: true,
    sortCaret: (order, column) => {
      if (!order) return (<span>&nbsp;&nbsp;<font color="gray">↑↓</font></span>);
      else if (order === 'desc') return (<span>&nbsp;&nbsp;<font color="gray">↑</font>↓</span>);
      else if (order === 'asc') return (<span>&nbsp;&nbsp;↑<font color="gray">↓</font></span>);
      return null;
    }
  }
]

const defaultSorted = [{
  dataField: 'per_capita',
  order: 'desc'
}];

const DataTable = (props) => {
  const data = props.data

  var rows = []
  data.features.forEach(function (feature) {
    var row = {
      "community": feature.properties.community,
      "per_capita": feature.properties.per_capita,
      "total": feature.properties.value ? feature.properties.value : 0
    }
    rows.push(row)
  })

  return (
    <ToolkitProvider
      keyField="community"
      data={rows}
      columns={columns}
      exportCSV={
        {fileName: 'custom.csv'}
      }
    >
      {
        props => (
          <div>
            <BootstrapTable
              { ...props.baseProps }
              striped
              hover
              condensed
              defaultSorted={defaultSorted}
              bordered={false}
              scrollY={true}
            />
            <ExportCSVButton
              { ...props.csvProps }
            >
              Export full data
            </ExportCSVButton>
          </div>
        )
      }
    </ToolkitProvider>

  )
}

export default DataTable
