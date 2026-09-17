import type { ReactNode } from 'react';

import {
  InstrumentDetailsContext,
  type InstrumentDetailsContextValue,
} from './instrument-details-context.shared';

export const InstrumentDetailsProvider = ({
  value,
  children,
}: {
  value: InstrumentDetailsContextValue;
  children: ReactNode;
}) => (
  <InstrumentDetailsContext.Provider value={value}>
    {children}
  </InstrumentDetailsContext.Provider>
);
