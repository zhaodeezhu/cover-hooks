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
    fixed: 'left'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 200,
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: 200,
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

  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      date: '2020-01-01'
    },
    {
      key: '2',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      date: '2020-01-01'
    }
  ]

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
        // selectType="none"
        pagePosition={['bottomRight']}
        onSelect={(selectedRows, selectedRowKeys) => {console.log(selectedRows)}}
      />
    </div>
  )
})


export default MyName