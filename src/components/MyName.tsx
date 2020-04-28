import React, {memo, useState, useMemo, useEffect, useCallback} from 'react';
import useDragModal from './useDragModal';

interface IProps {

}

const MyName:React.FC<IProps> = memo((props):React.ReactElement => {
  const [visible, setVisible] = useState(false)
  const getData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('aaa');
      }, 3000)
    })
  }
  const {triggerVisible, Modal, open, close, recoverPosition:myname, loadingFunc} = useDragModal({
    animate: 'bounceUp',
    isMask: false,
    width: 600,
    supperClose: true,
    title: 'Cover IT',
    draggable: false,
    defaultPosition: 'right',
    onOk: async () => {
      let res = await loadingFunc(getData)
      console.log(res)
    }
  })
  const { Modal: TwoModal, open: TwoOpen} = useDragModal({
    animate: 'roll',
    isMask: false,
    width: 400,
    closeTime: 2000,
    defaultPosition: 'left',
    title: 'LI LI',
    footer: 'Cover Is Now'
  })

  return (
    <div>
      <button onClick={() => {triggerVisible()}}>show</button>
      <button onClick={() => {setVisible(false);close()}}>关闭</button>
      <button onClick={() => {setVisible(true); open()}}>显示</button>
      <button onClick={() => {myname()}}>恢复</button>
      <button onClick={() => {TwoOpen()}}>消失</button>
      <Modal>
        <div 
          style={{
            height: 300
          }}
        >我是赵秀全</div>
      </Modal>
      <TwoModal />
    </div>
  )
})


export default MyName