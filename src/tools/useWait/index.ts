import {useEffect, useState, useCallback, useLayoutEffect} from 'react';

export interface IWaitProps {
  /** 默认值 */
  defaultValue?: 'S' | 'E',
  /** 执行时长 */
  time?: number;
}

type waitType = 'S' | 'E' | 'SE' | 'ES'

export interface IWaitReturn {
  /** 状态 */
  wait: waitType,
  /** 切换 */
  toggleWait: () => void;
  /** 开始到结束 */
  startToEnd: () => void;
  /** 结束到开始 */
  endToStart: () => void;
}

const useWait = (props:IWaitProps):IWaitReturn => {
  props = {
    defaultValue: 'E',
    time: 800,
    ...props
  }
  const [wait, setWait] = useState<waitType>(props.defaultValue as 'S' | 'E');

  /** 切换值 */
  const toggleWait = useCallback(() => {
    if(wait.indexOf('L') > -1) return
    if(wait === 'S') {
      startToEnd()
    } else {
      endToStart()
    }
  }, [wait])

  /** S - E */
  const startToEnd = useCallback(() => {
    setWait('SE');
    let timeout = window.setTimeout(() => {
      setWait('E')
      window.clearInterval(timeout)
    }, props.time)
  }, [])

  /** E - S */
  const endToStart = useCallback(() => {
    setWait('ES');
    let timeout = window.setTimeout(() => {
      setWait('S');
      window.clearInterval(timeout);
    }, props.time)
  }, [])
  
  /** 控制初始值 */
  useLayoutEffect(() => {
    if(wait === 'S') {
      setWait('E');
      return
    }
    toggleWait()
  }, [])

  return {
    wait,
    toggleWait,
    startToEnd,
    endToStart
  }
}

export default useWait;