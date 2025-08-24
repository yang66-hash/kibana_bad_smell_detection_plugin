import { useMemo } from 'react';

export const useKibanaHeader = () => {
  const actionMenuHeight = useMemo(() => {
    // only in serverless
    const actionMenu = document.querySelector(`[data-test-subj="kibanaProjectHeaderActionMenu"]`);

    return actionMenu?.getBoundingClientRect().height ?? 0;
  }, []);

  return { actionMenuHeight };
};
