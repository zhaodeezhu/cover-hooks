# cover-hooks使用与开发规范

- 致力于打造最全的react hooks行为库
- 此hook库源码使用typescript实现
- 此hook库分为两部分，componet hooks 和 tool hooks
- 当hook库到达一定规模的时候，我会单独开一个示例站点，供大家参考

## componet hooks

- 此为组件hook，原本class组件，代码繁重，生命周期处理复杂，性能优化麻烦，操作不够便捷
- 组件操作与组件本身属性分离，组件只表现UI层，造作交给hook实现

### useDragModal 可拖拽位置modal框

#### 解决问题

- 实现任意位置拖放
- 按钮自动加载loading
- 完全实现animate.css动画过度
- 初始位置自定义

#### 使用

```tsx
import React from 'react';
import {useDragModal} from 'cover-hooks';

const MyModal = () => {
  const {triggerVisible, Modal, open, close} = useDragModal({
    animate: 'bounceUp', // 动画
    isMask: false, // 是否有遮挡层
    width: 600, // 宽度
    supperClose: true, // 点击遮挡层关闭，需要isMask时生效
    title: 'Cover IT', // 标题
    draggable: false, // 是否可拖拽
    defaultPosition: 'right', // 默认的位置
  })
  
  return (
  	<div>
    	<button onClick={() => {open()}}></button>
      <Modal>
      	我是body
      </Modal>
    </div>
  )
}
```

#### 属性

```typescript
interface IUseDragModalProps {
  /** 显示的默认值不可控制visible控制modal框是否显示 */
  visible?: boolean;
  /** 动画, 完全还原animate.css动画 */
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
  /** 定时关闭的时间，设置此属性将会定时关闭 */
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
```

#### Hooks

```typescript
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
```



## tool hooks

- 常用的页面操作方法
- 一些过度状态

### useWindowSize 实时过去页面窗口的大小

#### 解决问题

- 每次要监听页面变化的时候都要绑定resize事件
- 还要重新调用原生方法获取大小

#### 使用

```tsx
import React, {useEffect} from 'react';
import {useWindowSize} from 'cover-hooks';

const WindowS = () => {
  const windowSize = useWindowSize();
  useEffect(() => {
    
  }, [windowSize]);
  return ''
}
```

#### Hooks

```typescript
interface IUseWindowSizeReturn {
  width: number;
  height: number;
}
```

### useLoading调用异步接口的loading状态

#### 解决问题

- 无需每次都要操作状态控制loading的值

#### 使用

```tsx
import React, {useEffect} from 'react';
import {Button} from 'antd';
import {useLoading} from 'cover-hooks';

const ButtonLoading = () => {
  const {loading, loadingFunc} = useLoading()
  const getData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('aaa');
      }, 3000)
    })
  }
  
  const handleClick = async () => {
    let res = await loadingFunc(getData)
  }
  
  return (
  	<div>
    	<Button loading={loading} onClick={handleClick}></Button>
    </div>
  )
}
```

#### Hooks

```typescript
interface IUseLoadingReturn {
  loadingFunc: (func: ()=>any)=>any;
  loading: boolean;
}
```

