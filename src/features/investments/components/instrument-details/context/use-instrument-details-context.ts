import { useContext } from 'react';

import { InstrumentDetailsContext } from './instrument-details-context.shared';

export const useInstrumentDetailsContext = () => {
  const context = useContext(InstrumentDetailsContext);

  if (!context) {
    throw new Error(
      'useInstrumentDetailsContext must be used within an InstrumentDetailsProvider',
    );
  }

  return context;
};
