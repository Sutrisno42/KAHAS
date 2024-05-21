import { useEffect } from 'react';

const usePageTitle = (title: string) => {
    useEffect(() => {
        document.title = `POS - ${title}`;
        return () => {
            document.title = `POS`;
        };
    }, [title]);
};

export default usePageTitle;
