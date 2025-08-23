import {
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarRootProps,
} from '@/components/ui/atoms/Avatar/Primitives'
import { BackgroundColor, TextColor } from '@/components/ui/tokens/colors'
import { useCallback, useState } from 'react'

function Avatar({
  src,
  altText,
  fallback,
  size = 'normal',
  rounded = 'normal',
  borderColor,
  isUploading,
  progress,
}: {
  src?: string | undefined
  altText: string
  fallback?: {
    text: string
    bgColor?: BackgroundColor
    color?: TextColor
  }
  size?: AvatarRootProps['size']
  rounded?: AvatarRootProps['rounded']
  borderColor?: AvatarRootProps['borderColor']
  isUploading?: boolean
  progress?: number
}) {
  const [loaded, setLoaded] = useState(false)
  const onLoad = useCallback(() => {
    setLoaded(true)
  }, [setLoaded])
  const onError = useCallback(() => {
    setLoaded(false)
  }, [setLoaded])
  return (
    <AvatarRoot
      size={size}
      rounded={rounded}
      borderColor={borderColor}
      isUploading={isUploading}
      progress={progress}
    >
      {src ? (
        <AvatarImage
          src={src}
          alt={altText}
          onLoad={onLoad}
          onError={onError}
        />
      ) : null}
      {!loaded && fallback ? (
        <AvatarFallback
          rounded={rounded}
          bgColor={fallback.bgColor}
          color={fallback.color}
          size={size}
        >
          {fallback.text}
        </AvatarFallback>
      ) : null}
    </AvatarRoot>
  )
}

export { Avatar }
