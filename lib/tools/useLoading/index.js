import * as tslib_1 from "tslib";
import { useState, useCallback } from 'react';
const useLoading = () => {
    const [loading, setLoading] = useState(false);
    const loadingFunc = useCallback((func) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        let res = yield func();
        setLoading(false);
        return res;
    }), []);
    return {
        loadingFunc,
        loading
    };
};
export default useLoading;
