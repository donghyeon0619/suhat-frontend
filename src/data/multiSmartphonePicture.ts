export interface PictureOption {
  id: number;
  url: string;
}

const images = import.meta.glob('@/assets/img/game/multi/picture/*.png', { eager: true }) as Record<string, { default: string }>;
export const multiSmartphonePicture: PictureOption[] = Object.keys(images).map((key, index) => {
  const image = images[key].default;
  return {
    id: index + 1,
    url: image,
  };
});