import React, {useState, memo, useCallback, useEffect, useMemo, useRef, useLayoutEffect} from 'react';
import animateGroup, {Animate} from './animateGroup';
import useLoading from '../../tools/useLoading';

import Button from 'antd/es/button';
import 'antd/es/button/style/index.css';

import 'animate.css'
import './index.less';
import 'font-awesome/css/font-awesome.css';


// declare function clearTimeout(timeoutId: any): void;
// declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;

interface IUseDragModalProps {
  /** 显示的默认值 */
  visible?: boolean;
  /** 动画 */
  animate?: Animate,
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
  /** 默认位置 */
  defaultPosition?: 'left' | 'right' | 'center';
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 点击蒙版可关闭 */
  supperClose?: boolean;
  /** 点击确认按钮 */
  onOk?: () => void
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
  /** 异步时让确认按钮处于加载状态 */
  loadingFunc: (func:()=>any) => any;
}

const useDragModal = (props:IUseDragModalProps = {
  animate: 'fade',
  visible: false,
  isMask: true,
  width: 500,
  defaultPosition: 'center',
  draggable: true,
  supperClose: false
}):IUseDragModalReturn => {
  /** 记录自动关闭的定时器 */
  const closeTimeout = useRef<number>()
  /** 获取dom的高度 */
  const modalDom = useRef<HTMLDivElement>()

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

  /** 异步加载数据 */
  const {loadingFunc, loading} = useLoading();

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
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let ratioX = (windowWidth - width) / 2 / windowWidth * 100;
    let ratioY = 20;
    let sim = 2;
    switch(props.defaultPosition) {
      case 'left': 
        ratioX = sim
        ratioY = sim
        break;
      case 'right':
        ratioX = (windowWidth - (windowWidth * (sim / 100) + (props.width as number))) / windowWidth * 100;
        ratioY = sim
        break;
      default: 
    }

    setPosition({
      x: ratioX,
      y: ratioY
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

  // 原始的footer
  const OriginFooter = useMemo(():React.ReactElement => {
    return (
      <div className="cv-drag-modal-footer cv-drag-modal-orgin-footer">
        <Button>取消</Button>
        <Button
          onClick={() => {props.onOk && props.onOk()}}
          style={{marginLeft: 8}}
          type="primary"
          loading={loading}
        >
          确认
        </Button>
      </div>
    )
  }, [loading])

  // 获取footer
  const getFooter = useMemo((): void | React.ReactElement => {
    if(!props.footer) {
      return <React.Fragment>{OriginFooter}</React.Fragment>
    } else {
      return (
        <div className="cv-drag-modal-footer">
          {props.footer}
        </div>
      )
    }

  }, [props.footer, loading])

  /** 添加自动关闭定时器 */
  const addCloseTimeout = ():void => {
    if(props.closeTime && visible === true) {
      closeTimeout.current = window.setTimeout(() => {
        close()
      }, props.closeTime)
    }
  }

  /** 移除自动关闭定时器 */
  const removeCloseTimeout = ():void => {
    if(closeTimeout.current) {
      clearTimeout(closeTimeout.current)
    }
  }

  /** 鼠标划入Modal框 */
  const handleModalMouseEnter = useCallback(() => {
    removeCloseTimeout();
  }, [visible])

  /** 鼠标离开Modal框 */
  const handleModalMouseLeave = useCallback(() => {
    addCloseTimeout();
  }, [visible])

  // 计算默认的位置
  useEffect(() => {
    setStartPosition()
  }, [])

  /** 设置定时关闭的时间 */
  useEffect(() => {
    addCloseTimeout()
    return removeCloseTimeout;
  }, [visible])

  /** 定义Modal组件 */
  const Modal:React.FC = memo((modal):React.ReactElement => {
    return (
      <React.Fragment>
        {getDisplayBlock && (
          <div 
            className={`cv-modal animated ${getMaskAnimateClassName}`} 
            style={cvModalStyle}
            onMouseEnter={handleModalMouseEnter}
            onMouseLeave={handleModalMouseLeave}
            ref={(dom) => {modalDom.current = dom as HTMLDivElement}}
            onClick={() => {props.supperClose && props.isMask && close()}}
          >
            <div 
              className={`cv-drag-modal animated ${getAnimateClassName}`}
              draggable={props.draggable}
              onDragStart={handleOndragStart}
              onDragEnd={handleOndragEnd}
              style={cvDragModalStyle}
              onClick={(e) => {e.stopPropagation()}}
            >
              <span className="cv-drag-moda-close fa fa-close" onClick={close}></span>
              {getTitle}
              <div className="cv-drag-modal-body" style={cvDragModalFooterStyle}>
                {modal.children}
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
      width: props.width,
      boxShadow: `${!props.isMask ? '0 0 2px 1px #f0f0f0' : ''}`
    }
  }, [getDisplayBlock, position])

  const cvDragModalFooterStyle: React.CSSProperties = useMemo(():React.CSSProperties => {
    return {
      marginBottom: props.footer ? 55 : 0
    }
  }, [props.footer])

  return {
    triggerVisible,
    Modal,
    visible,
    open,
    close,
    recoverPosition: setStartPosition,
    loadingFunc
  }
}

export default useDragModal;