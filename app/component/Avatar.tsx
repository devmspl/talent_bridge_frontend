import React from 'react';
import Image, { StaticImageData } from 'next/image';
import profile from '@/public/assets/profile/Avatar.png';

interface AvatarProps {
  avatar?: string | null;
  avatarSvg?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  fallbackImage?: StaticImageData;
}

const Avatar: React.FC<AvatarProps> = ({
  avatar,
  avatarSvg,
  alt = "Profile Image",
  width = 64,
  height = 64,
  className = "",
  style = {},
  fallbackImage = profile
}) => {
  const getAvatarSrc = (): string | StaticImageData => {
    // Priority 1: If avatarSvg is available, extract base64 data
    if (avatarSvg) {
      const base64Match = avatarSvg.match(/data:image\/[^;]+;base64,([^"]+)/);
      if (base64Match) {
        return `data:image/jpeg;base64,${base64Match[1]}`;
      }
    }
    
    // Priority 2: Regular avatar logic
    if (avatar) {
      if (avatar.startsWith("https://lh3.googleusercontent.com/")) {
        return avatar;
      }
      if (avatar.startsWith("http")) {
        return avatar;
      }
      return `https://backend.webridgetalent.com/assets/images/${avatar}`;
    }
    
    // Priority 3: Fallback to dummy avatar
    return fallbackImage;
  };

  return (
    <Image
      src={getAvatarSrc()}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
};

export default Avatar;
