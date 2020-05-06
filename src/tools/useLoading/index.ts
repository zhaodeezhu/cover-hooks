import {useEffect, useState, useCallback} from 'react';

/** 返回值 */
export interface IUseLoadingReturn {
  loadingFunc: (func: ()=>any)=>any;
  loading: boolean;
}

const useLoading = (): IUseLoadingReturn => {
  const [loading, setLoading] = useState(false);

  const loadingFunc = useCallback(async (func: ()=>any) => {
    setLoading(true);
    let res = await func();
    setLoading(false);
    return res;
  }, [])
  
  return {
    loadingFunc,
    loading
  }
}

export default useLoading;