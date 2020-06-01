import React, {useState, memo, useCallback, useEffect, useMemo, useRef, useLayoutEffect} from 'react';
import Table from 'antd/es/table';
import {TableProps} from 'antd/es/table/Table.d'
import 'antd/es/radio/style/index.css'
import 'antd/es/table/style/index.css';
import 'antd/es/pagination/style/index.css';
import 'antd/es/checkbox/style/index.css';

import './index.less';

interface IRowSSelection {
  /** 自定义列表选择框宽度, 默认60px */
  columnWidth?: string | number;
  /** 自定义列表选择框标题 */
  columnTitle?: string | React.ReactNode;
  /**	把选择框列固定在左边 */
  fixed?: boolean;
  /** 选择框的默认属性配置 */
  getCheckboxProps?: (record) => object;
  /** 自定义选择项时去掉『全选』『反选』两个默认选项 */
  hideDefaultSelections?: boolean;
  /** 渲染勾选框，用法与 Column 的 render 相同 */
  renderCell?: (checked, record, index, originNode) => any;
  /** 指定选中项的 key 数组，需要和 onChange 进行配合 */
  selectedRowKeys?: string[] | number[];
  /** 自定义选择项 配置项, 设为 true 时使用默认选择项 */
  selections?: any[] | boolean;
  /**	用户手动选择/取消选择某行的回调 */
  onSelect?: (ecord, selected, selectedRows, nativeEvent) => void;
  /** 用户手动选择/取消选择所有行的回调 */
  onSelectAll?: (selected, selectedRows, changeRows) => void;
  /** 用户手动选择反选的回调 */
  onSelectInvert?: (selectedRowKeys) => void;
}

export interface ICoverTable {
  /** 数据源 */
  dataSource: any[],
  /** 列配置 */
  columns: any[],
  /** 自定义行的类名 */
  rowClassName?: (record, index) => string;
  /** 选择后的触发的事件，使用此参数则出现选择框 */
  onSelect?: <T>(selectedRows:T[], selectedRowKeys: any[]) => void;
  /** 选择框的类型 */
  selectType?: 'checkbox' | 'radio' | 'none';
  /** 选择框的额外属性，参考antd */
  rowSelection?: IRowSSelection;
  /** 分页位置 */
  pagePosition?: ('topLeft' | 'topCenter' | 'topRight' |'bottomLeft' | 'bottomCenter' | 'bottomRight')[]
}

const CoverTable:React.FC<ICoverTable> = memo((props):React.ReactElement => {

  /** 选择配置 */
  const rowSelection = useMemo(() => {
    if(!props.onSelect || props.selectType === 'none') {
      return {}
    }
    return {
      rowSelection: {
        type: props.selectType,
        onChange: (selectedRowKeys, selectedRows) => {
          props.onSelect && props.onSelect(selectedRows, selectedRowKeys)
        },
        ...props.rowSelection
      }
    }
  }, [props.selectType])

  /** 分页配置 */
  const pagination = useMemo(() => {
    return {
      position: props.pagePosition
    }
  }, [])

  return (
    <div className="cover-table">
      <Table 
        bordered={true}
        columns={props.columns}
        dataSource={props.dataSource}
        rowClassName={(record, index) => `cover-row ${props.rowClassName && props.rowClassName(record, index)}`}
        pagination={pagination}
        size="small"
        {...rowSelection}
      />
    </div>
  )
})

CoverTable.defaultProps = {
  selectType: 'checkbox',
  rowSelection: {}
}

export default CoverTable;