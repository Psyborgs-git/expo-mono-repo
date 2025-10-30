export const useToast = () => {
  const showSuccess = (msg: string) => {
    // Lightweight fallback - could integrate with a Toast component
    // eslint-disable-next-line no-console
    console.log('Toast success:', msg);
  };
  const showError = (msg: string) => {
    // eslint-disable-next-line no-console
    console.error('Toast error:', msg);
  };

  return { showSuccess, showError };
};

export default useToast;
