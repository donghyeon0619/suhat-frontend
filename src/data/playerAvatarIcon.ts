export interface PlayerAvatarIcon {
  id: number;
  url: string;
}

const images = import.meta.glob('@/assets/icons/game/player/*.svg', { eager: true }) as Record<string, { default: string }>;
export const playerAvatarIcons: PlayerAvatarIcon[] = Object.keys(images).map((key, index) => {
  const image = images[key].default;
  return {
    id: index + 1,
    url: image,
  };
});