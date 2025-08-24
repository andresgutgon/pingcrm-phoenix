import {
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarRootProps,
} from '@/components/ui/atoms/Avatar/Primitives'
import { BackgroundColor, TextColor } from '@/components/ui/tokens/colors'

function Avatar({
  src,
  altText,
  fallback,
  size = 'normal',
  rounded = 'normal',
  borderColor,
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
}) {
  return (
    <AvatarRoot size={size} rounded={rounded} borderColor={borderColor}>
      <AvatarImage src={src} alt={altText} />
      {fallback ? (
        <AvatarFallback
          rounded={rounded}
          bgColor={fallback.bgColor}
          color={fallback.color}
        >
          {fallback.text}
        </AvatarFallback>
      ) : null}
    </AvatarRoot>
  )
}

export { Avatar }
