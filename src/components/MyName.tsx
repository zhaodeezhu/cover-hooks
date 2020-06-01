import React, {memo, useState, useMemo, useEffect, useCallback} from 'react';
import useDragModal from './useDragModal';
import useWait from '../tools/useWait/index';
import CoverTable from './CoverTable';

interface IProps {

}

const MyName:React.FC<IProps> = memo((props):React.ReactElement => {
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

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    }
  ]

  return (
    <div>
      <CoverTable 
        dataSource={dataSource}
        columns={columns}
        // selectType="none"
        pagePosition={['topRight']}
        onSelect={(selectedRows, selectedRowKeys) => {console.log(selectedRows)}}
      />
    </div>
  )
})


export default MyName