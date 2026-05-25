import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'pri' | 'ghost' | 'out';
type Size = 'sm' | 'md' | 'lg';

function classes(variant: Variant, size: Size, extra?: string) {
  const v = `btn btn-${variant}`;
  const s = size === 'md' ? '' : ` btn-${size}`;
  return `${v}${s}${extra ? ' ' + extra : ''}`;
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

/** Native <button>. */
export const Button = forwardRef<
  HTMLButtonElement,
  CommonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(function Button({ variant = 'pri', size = 'md', className, ...rest }, ref) {
  return <button ref={ref} className={classes(variant, size, className)} {...rest} />;
});

/** Router <Link> styled as a button. */
export function ButtonLink({
  variant = 'pri',
  size = 'md',
  className,
  ...rest
}: CommonProps & LinkProps) {
  return <Link className={classes(variant, size, className)} {...rest} />;
}

/** External anchor styled as a button (for ritmopadel.app, etc). */
export function ButtonAnchor({
  variant = 'pri',
  size = 'md',
  className,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={classes(variant, size, className)} {...rest} />;
}
