import clsx from 'clsx';

import { useTheme } from '@context/theme-context';
import { getButtonClassName } from '@ui';

const BRAND_LINK_HREF = 'https://devonion.com';
const LIGHT_LOGO_SRC = '/brand/DEVONION-LOGO-LIGHT.svg';
const DARK_LOGO_SRC = '/brand/DEVONION-LOGO-DARK.svg';

type BrandLinkProps = {
  className?: string;
  logoClassName?: string;
};

export const BrandLink = ({ className, logoClassName }: BrandLinkProps) => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? DARK_LOGO_SRC : LIGHT_LOGO_SRC;

  return (
    <a
      href={BRAND_LINK_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Devonion home page"
      className={clsx(
        getButtonClassName({ variant: 'ghost' }),
        'inline-flex shrink-0 items-center justify-center',
        className,
      )}
    >
      <img
        src={logoSrc}
        alt="DevOnion"
        className={clsx('block w-auto object-contain', logoClassName)}
        loading="eager"
        decoding="async"
      />
    </a>
  );
};
