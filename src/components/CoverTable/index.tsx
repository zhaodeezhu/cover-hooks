import React, {useState, memo, useCallback, useEffect, useMemo, useRef, useLayoutEffect, Component} from 'react';
import Table from 'antd/es/table';
import ResizeableTitle from './ResizeableTitle'
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
  /** 改变列 */
  handleResize?: (columns: any[], column?: any) => void
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

const CoverTables:React.FC<ICoverTable> = memo((props):React.ReactElement => {

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

  /** 设置可调整宽度头 */
  const components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  /** 宽度变化 */
  const handleResize = index => (e, { size }) => {
    const nextColumns = [...props.columns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    props.handleResize && props.handleResize(nextColumns)
  };

  const columns = props.columns.map((col, index) => ({
    ...col,
    onHeaderCell: column => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <div className="cover-table">
      <Table 
        bordered={true}
        columns={columns}
        components={components}
        dataSource={props.dataSource}
        rowClassName={(record, index) => `cover-row ${props.rowClassName && props.rowClassName(record, index)}`}
        pagination={pagination}
        size="small"
        {...rowSelection}
      />
    </div>
  )
})

class CoverTable extends Component<ICoverTable, {}> {
  /** 属性默认值 */
  static defaultProps = {
    selectType: 'checkbox',
    rowSelection: {}
  }

  /** 自定义单元格 */
  private components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  /** 选择配置 */
  private get rowSelection() {
    let {onSelect, selectType, rowSelection} = this.props;
    if(!onSelect || selectType === 'none') {
      return {}
    }
    return {
      rowSelection: {
        type: selectType,
        columnWidth: 40,
        onChange: (selectedRowKeys, selectedRows) => {
          onSelect && onSelect(selectedRows, selectedRowKeys)
        },
        ...rowSelection
      }
    }
  }

  /** 分页设置 */
  private get pagination() {
    const {pagePosition} = this.props
    return {
      position: pagePosition
    }
  }

  /** 二次处理列 */
  private get columns() {
    return this.props.columns.map((col, index) => ({
      ...col,
      ellipsis: true,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));
  }

  /** 调整列宽 */
  private handleResize = index => (e, { size }) => {
    const {columns,handleResize} = this.props
    const nextColumns = [...columns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    handleResize && handleResize(nextColumns, nextColumns[index])
  };

  render() {
    return (
      <div className="cover-table">
        <Table 
          bordered={true}
          columns={this.columns}
          components={this.components}
          dataSource={this.props.dataSource}
          rowClassName={(record, index) => `cover-row ${this.props.rowClassName && this.props.rowClassName(record, index)}`}
          pagination={this.pagination}
          size="small"
          scroll={{x: 2400, y: 400}}
          {...this.rowSelection}
        />
      </div>
    )
  }
}

// CoverTable.defaultProps = {
//   selectType: 'checkbox',
//   rowSelection: {}
// }

export default CoverTable;