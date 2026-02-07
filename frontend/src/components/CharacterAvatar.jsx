import { useState } from 'react';
import { getCharacterImage, getCharacterEmoji } from '../utils/characters';

const SIZE_CLASSES = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
  '2xl': 'w-28 h-28',
  '3xl': 'w-36 h-36',
};

const EMOJI_SIZE_CLASSES = {
  xs: 'text-lg',
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
  '2xl': 'text-7xl',
  '3xl': 'text-8xl',
};

function CharacterAvatar({ character, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getCharacterImage(character);

  if (!imageUrl || imgError) {
    return (
      <span className={`${EMOJI_SIZE_CLASSES[size] || EMOJI_SIZE_CLASSES.md} ${className}`}>
        {getCharacterEmoji(character)}
      </span>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={character}
      onError={() => setImgError(true)}
      className={`${SIZE_CLASSES[size] || SIZE_CLASSES.md} object-contain drop-shadow-lg ${className}`}
      draggable={false}
    />
  );
}

export default CharacterAvatar;
