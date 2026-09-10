import type { InvestmentInstrument } from '@features/investments/api';

import { InstrumentCard } from '../instrument-card';

type InstrumentsListGridProps = {
  instruments: InvestmentInstrument[];
  onEdit: (instrument: InvestmentInstrument) => void;
  onDelete: (instrument: InvestmentInstrument) => void;
};

export const InstrumentsListGrid = ({
  instruments,
  onEdit,
  onDelete,
}: InstrumentsListGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {instruments.map((instrument) => (
        <InstrumentCard
          key={instrument.id}
          instrument={instrument}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
