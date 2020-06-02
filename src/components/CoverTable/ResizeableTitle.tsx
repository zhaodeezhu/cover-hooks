import React, {useState, memo, useCallback, useEffect, useMemo, useRef, useLayoutEffect} from 'react';
import { Resizable } from 'react-resizable';

interface IResizeableTitleProps {
  /** 大小改变事件 */
  onResize: () => void;
  /** 宽度 */
  width: number;
}

const ResizeableTitle:React.FC<IResizeableTitleProps> = memo((props):React.ReactElement => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
})

export default ResizeableTitle