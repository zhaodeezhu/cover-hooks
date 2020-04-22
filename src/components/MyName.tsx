import React, {memo, useState, useMemo, useEffect, useCallback} from 'react';
import useDragModal from './useDragModal';

interface IProps {

}

const MyName:React.FC<IProps> = memo((props):React.ReactElement => {
  const [visible, setVisible] = useState(false)
  const {triggerVisible, Modal, open, close, recoverPosition:myname} = useDragModal({
    animate: 'bounce',
    isMask: false,
    width: 400,
    // closeTime: 2000,
    title: 'Cover IT',
    footer: 'zhaodeezhu'
  })
  const { Modal: TwoModal, open: TwoOpen} = useDragModal({
    animate: 'bounce',
    isMask: false,
    width: 400,
    closeTime: 2000,
    title: 'LI LI',
    footer: 'Cover Is Now'
  })
  return (
    <div>
      <button onClick={() => {triggerVisible()}}>显示</button>
      <button onClick={() => {setVisible(false);close()}}>关闭</button>
      <button onClick={() => {setVisible(true); open()}}>显示</button>
      <button onClick={() => {myname()}}>恢复</button>
      <button onClick={() => {TwoOpen()}}>Two</button>
      {visible && <Modal />}
      <TwoModal />
    </div>
  )
})


export default MyName