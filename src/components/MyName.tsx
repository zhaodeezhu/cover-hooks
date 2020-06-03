import React, {memo, useState, useMemo, useEffect, useCallback} from 'react';
import useDragModal from './useDragModal';
import useWait from '../tools/useWait/index';
import CoverTable from './CoverTable';

interface IProps {

}

const initColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    fixed: 'left',
    render: (text, record, index) => {
      if(index === 0) {
        return {
          children: text,
          props: {
            rowSpan: 3
          }
        }
      }
      return {
        children: text,
          props: {
            rowSpan: 0
          }
      }
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 220,
    children: [
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 100,
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
        width: 120,
      },
    ]
  },
  {
    title: '生意',
    dataIndex: 'bis',
    key: 'bis',
    width: 200,
  },
  {
    title: '生或',
    dataIndex: 'bis2',
    key: 'bi2s2',
    width: 300,
  },
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  }
]

const MyName:React.FC<IProps> = memo((props):React.ReactElement => {

  const [columns, setColumns] = useState<any[]>(initColumns)

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])

  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      date: '2020-01-01',
      pra: 3,
      orid: 1,
    },
    {
      key: '2',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      date: '2020-01-01',
      orid: 1,
    },
    {
      key: '3',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      date: '2020-01-01',
      orid: 1
    }
  ]

  const rowSelection = {
    getCheckboxProps: (record) => {
      return {
        style: {
          display: record.pra ? '' : 'none'
        }
      }
    },
    selectedRowKeys: selectedRowKeys
  }

  const handleResize = (nextColumns, column) => {
    // console.log(column)
    setColumns(() => nextColumns);
  }

  return (
    <div>
      <CoverTable 
        dataSource={dataSource}
        columns={columns}
        handleResize={handleResize}
        rowSelection={rowSelection}
        // selectType="none"
        pagePosition={['bottomRight']}
        onSelect={(selectedRows, selectedRowKeys) => {
          let data = dataSource.filter(item => {
            return selectedRows[0] && selectedRows[0]['orid'] === item.orid
          }).map(item => item.key)
          console.log(selectedRowKeys)
          setSelectedRowKeys(data)
        }}
      />
    </div>
  )
})


export default MyName