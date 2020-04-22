import React, {useState, memo, useCallback, useEffect} from 'react';

interface IUseWindowSizeReturn {
  width: number;
  height: number;
}

/* 获取页面大小 */
const getSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

const useWindowSize = ():IUseWindowSizeReturn => {
  /** 窗口大小 */
  const [windowSize, setWindowSize] = useState(getSize())

  const handleResize = () => {
    setWindowSize(getSize())
  }

  /** 添加监听窗口变化事件 */
  const windowChange = useCallback(() => {
    window.addEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    windowChange();
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return windowSize;
}

export default useWindowSize