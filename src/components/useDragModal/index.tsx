import React, {useState, memo, useCallback, useEffect, useMemo, useRef} from 'react';
import animateGroup from './animateGroup'

import './index.less';
import 'font-awesome/css/font-awesome.css';

interface IUseDragModalProps {
  /** 显示的默认值 */
  visible?: boolean;
  /** 动画 */
  animate?: 'fade' | 'zoom' | 'rotate' | 'bounce' | 'bounceUp',
  /** 是否组要遮挡层 */
  isMask?: boolean;
  /** 高度 */
  height?: number | string;
  /** 宽度 */
  width?: number | string;
  /** 标题 */
  title?: string | React.ReactElement;
  /** 底部 */
  footer?: string | React.ReactElement;
  /** 定时关闭 */
  closeTime?: number;
}

interface IUseDragModalReturn {
  /** Modal框组件 */
  Modal: React.FC;
  /** 切换显示 */
  triggerVisible: () => void;
  /** 显示 */
  visible: boolean;
  /** 打开 */
  open: () => void;
  /** 关闭 */
  close: () => void;
  /** 恢复初始位置 */
  recoverPosition: () => void;
}

const useDragModal = (props:IUseDragModalProps):IUseDragModalReturn => {
  props = {
    animate: 'fade',
    visible: false,
    isMask: true,
    width: 500,
    ...props
  }
  /** 控制显示 */
  const [visible, setVisible] = useState(props.visible ? true : false);
  /** 控制显示的动画 */
  const [fadeIn, setFadeIn] = useState(!visible);
  /** 控制隐藏的动画 */
  const [fadeOut, setFadeOut] = useState(visible)

  /** modal框的位置 */
  const [position, setPosition] = useState({
    x: 50,
    y: 50
  })

  /** 记录起始位置 */
  const startPosition = {
    x: 0,
    y: 0
  }

  /** 设置定时改变值并还原值 */
  const changeAndOriginal = useCallback((set) => {
    set(true)
    let timeout = setTimeout(() => {
      set(false);
      clearTimeout(timeout);
    }, 1000)
  }, [])

  /** 设置显示值 */
  const handleSetVisible = (value?:boolean) => {
    setVisible((prevVisible) => {
      if(!prevVisible && value === undefined) {
        changeAndOriginal(setFadeIn);
      } else if(prevVisible && value === undefined) {
        changeAndOriginal(setFadeOut);
      } else if (value !== prevVisible && value){
        changeAndOriginal(setFadeIn);
      } else if (value !== prevVisible && !value) {
        changeAndOriginal(setFadeOut);
      }
      if(value === false && closeTimeout.current) {
        clearTimeout(closeTimeout.current)
      }
      return value !== undefined ? value : !prevVisible
    })
  }

  /** 切换显示 */
  const triggerVisible = useCallback(() => {
    handleSetVisible()
  }, [])

  /** 打开 */
  const open = useCallback(() => {
    handleSetVisible(true)
  }, [])

  /** 关闭 */
  const close = useCallback(() => {
    handleSetVisible(false);
  }, [visible])

  /** 拖拽开始 */
  const handleOndragStart = useCallback((e) => {
    e.persist();
    startPosition.x = e.nativeEvent.offsetX;
    startPosition.y = e.nativeEvent.offsetY;
  }, [])

  /** 拖拽结束 */
  const handleOndragEnd = useCallback((e) => {
    e.persist();
    setPosition({
      x: (e.pageX - startPosition.x) / window.innerWidth * 100,
      y: (e.pageY - startPosition.y) / window.innerHeight * 100
    })
  }, [])

  /** 判断动画 */
  const getAnimateClassName = useMemo(() => {
    let returnAnimate = animateGroup[props.animate ? props.animate : 'fade']
    if(visible && fadeIn) {
      return returnAnimate[0]
    } else if(!visible && fadeOut) {
      return returnAnimate[1]
    }  else {
      return ''
    }
  }, [visible, fadeIn, fadeOut])

  /** 蒙版动画 */
  const getMaskAnimateClassName = useMemo(() => {
    if(visible && fadeIn) {
      return 'fadeIn'
    } else if(!visible && fadeOut) {
      return 'fadeOut'
    }  else {
      return ''
    }
  }, [visible, fadeIn, fadeOut])

  /** 判断显示 */
  const getDisplayBlock = useMemo(() => {
    if(visible) {
      return true
    } else if(!visible && fadeOut) {
      return true
    } else {
      return false
    }
  }, [visible, fadeIn, fadeOut])

  /** 计算默认位置 */
  const setStartPosition = useCallback(() => {
    let width = props.width as number;
    let windowSize = window.innerWidth;
    let ratio = (windowSize - width) / 2 / windowSize * 100;
    
    setPosition({
      x: ratio,
      y: 20
    })
  }, [])

  /** 标题 */
  const getTitle = useMemo((): void | React.ReactElement => {
    if(!props.title) {
      return 
    } else {
      return (
        <div className="cv-drag-modal-title">
          {props.title}
        </div>
      )
    }
  }, [props.title])

  const getFooter = useMemo((): void | React.ReactElement => {
    if(!props.title) {
      return 
    } else {
      return (
        <div className="cv-drag-modal-footer">
          {props.footer}
        </div>
      )
    }

  }, [props.footer])

  // 计算默认的位置
  useEffect(() => {
    setStartPosition()
  }, [])

  /** 记录自动关闭的定时器 */
  const closeTimeout = useRef<NodeJS.Timeout>()
  /** 设置定时关闭的时间 */
  useEffect(() => {
    if(props.closeTime && visible === true) {
      const id = setTimeout(() => {
        close()
      }, props.closeTime)
      closeTimeout.current = id;
    }
    return () => {
      if(closeTimeout.current) {
        clearTimeout(closeTimeout.current)
      }
    }
  }, [visible])

  /** 定义Modal组件 */
  const Modal:React.FC = memo(():React.ReactElement => {
    return (
      <React.Fragment>
        {getDisplayBlock && (
          <div className={`cv-modal animated ${getMaskAnimateClassName}`} style={cvModalStyle}>
            <div 
              className={`cv-drag-modal animated ${getAnimateClassName}`}
              draggable={true}
              onDragStart={handleOndragStart}
              onDragEnd={handleOndragEnd}
              style={cvDragModalStyle}
            >
              <span className="cv-drag-moda-close fa fa-close" onClick={close}></span>
              {getTitle}
              <div className="cv-drag-modal-body">
                我是主体
              </div>
              {getFooter}
            </div>
          </div>
        )}
      </React.Fragment>
    )
  });

  /** 这单层样式控制 */
  const cvModalStyle:React.CSSProperties = useMemo(():React.CSSProperties => {
    return {
      backgroundColor: props.isMask ? 'rgba(0, 0, 0, 0.4)' : '',
      pointerEvents: props.isMask ? 'visible' : 'none'
    }
  }, [props.isMask])

  /** Modal框的样式控制 */
  const cvDragModalStyle:React.CSSProperties = useMemo(():React.CSSProperties => {
    return {
      display: `${getDisplayBlock ? 'block' : 'none'}`,
      top: `${position.y}%`,
      left: `${position.x}%`,
      width: props.width
    }
  }, [getDisplayBlock, position])

  return {
    triggerVisible,
    Modal,
    visible,
    open,
    close,
    recoverPosition: setStartPosition
  }
}


export default useDragModal;