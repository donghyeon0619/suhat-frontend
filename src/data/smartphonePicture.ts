export interface PictureOption {
  id: number;
  url: string;
}

const images = import.meta.glob('@/assets/img/game/picture/*.png', { eager: true }) as Record<string, { default: string }>;
export const smartphonePicture: PictureOption[] = Object.keys(images).map((key, index) => {
  const image = images[key].default;
  return {
    id: index + 1,
    url: image,
  };
});