import React, {memo, useState, useMemo, useEffect, useCallback} from 'react';
import useDragModal from './useDragModal';
import useWait from '../tools/useWait/index';

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
    footer: false,
    isMask: false,
    // width: 600,
    // supperClose: true,
    // title: 'Cover IT',
    // draggable: false,
    // defaultPosition: 'right',
    // onOk: async () => {
    //   let res = await loadingFunc(getData)
    //   console.log(res)
    // }
  })
  // const { Modal: TwoModal, open: TwoOpen} = useDragModal({
  //   animate: 'roll',
  //   isMask: false,
  //   width: 400,
  //   closeTime: 2000,
  //   defaultPosition: 'left',
  //   title: 'LI LI',
  //   footer: 'Cover Is Now'
  // })
  const {wait, toggleWait} = useWait({})
  return (
    <div>
      <button onClick={() => {triggerVisible()}}>show</button>
      <button onClick={() => {setVisible(false);close()}}>关闭</button>
      <button onClick={() => {setVisible(true); open()}}>显示</button>
      <button onClick={() => {myname()}}>恢复</button>
      <button onClick={() => {toggleWait()}}>等待</button>
      <Modal>
        赵嘚住
      </Modal>

      {
         wait !== 'E' && (
          <div className={`animated ${wait === 'ES' ? 'bounceIn' : (wait === 'SE' ? 'bounceOut' : '')}`} style={{
            width: 100,
            height: 100,
            background: 'red'
          }}></div>
        )
      }
    </div>
  )
})


export default MyName