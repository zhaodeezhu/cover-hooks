import { Animate } from './src/components/useDragModal/animateGroup';
import React from 'react';

declare module "cover-hooks" {
  /** 可拖拽的Modal框 */
  export function useDragModal(props: IUseDragModalProps):IUseDragModalReturn;
  /** loading控制 */
  export function useLoading():IUseLoadingReturn;
  /** 监听窗口变化 */
  export function useWindowSize():IUseWindowSizeReturn;
}

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

/** 返回值 */
interface IUseLoadingReturn {
  loadingFunc: (func: ()=>any)=>any;
  loading: boolean;
}

interface IUseWindowSizeReturn {
  width: number;
  height: number;
}