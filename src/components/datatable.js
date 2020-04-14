import React from "react"

import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import paginationFactory from 'react-bootstrap-table2-paginator';

const columns = [
  {
    dataField: 'community',
    text: 'Community Area',
    sort: true,
    style: {
      width: '50%',
      fontWeight: 600,
      lineHeight: 1.4
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

const paginationOptions = {
  paginationSize: 40,
  // alwaysShowAllBtns: true, // Always show next and previous button
  withFirstAndLast: false, // Hide the going to First and Last page button
  hideSizePerPage: true, // Hide the sizePerPage dropdown always
  disablePageTitle: true,
  sizePerPageList: [{
    text: '30', value: 40
  }] // A numeric array is also available. the purpose of above example is custom the text
}

const CustomExportCSVButton = (props) => {
  const handleClick = () => {
    props.onExport();
  };
  return (
    <div style={{textAlign: 'right'}}>
      <button
        className="btn"
        onClick={ handleClick }
        style={{backgroundColor: '#f4f4f4', fontSize: '0.8rem'}}
      >
        ↓ Download neighborhood data
      </button>
    </div>
  );
};

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
      exportCSV={{
        fileName: `Recorded COVID-19 Deaths as of ${props.last_updated} from CCME`,
        blobType: 'text/csv;charset=ansi'
      }}
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
              pagination={paginationFactory(paginationOptions)}
            />
            <CustomExportCSVButton
              { ...props.csvProps }
            />
          </div>
        )
      }
    </ToolkitProvider>

  )
}

export default DataTable
