import type { ImgHTMLAttributes } from 'react';

type SiteImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height' | 'alt'> & {
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  webpSrcSet?: string;
};

/** Shared defaults apply equally to uploaded assets and public YouTube imagery. */
export function SiteImage({ priority = false, webpSrcSet, loading, decoding = 'async', fetchPriority, ...props }: SiteImageProps) {
  const image = <img {...props} loading={loading ?? (priority ? 'eager' : 'lazy')} decoding={decoding} fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')} />;
  return webpSrcSet ? <picture><source type="image/webp" srcSet={webpSrcSet} sizes={props.sizes} />{image}</picture> : image;
}