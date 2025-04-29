import Image from "next/image"

interface ClientAvatarProps {
  clientId: string;
  clientName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ClientAvatar({ clientId, clientName = 'Client', size = 'md' }: ClientAvatarProps) {
  // Get a consistent number from 1 to 13 based on client ID
  const faceNumber = 1 + (parseInt(clientId.substring(0, 8), 16) % 13);
  
  // Define size classes based on the size prop
  const containerClasses = {
    sm: "w-14 h-14",
    md: "w-20 h-20",
    lg: "w-40 h-40"
  };
  
  const imageClasses = {
    sm: "w-full h-full",
    md: "w-full h-full",
    lg: "w-full h-full"
  };
  
  const imageSizes = {
    sm: { width: 28, height: 28 },
    md: { width: 80, height: 80 },
    lg: { width: 160, height: 160 }
  };
  
  return (
    <div className={`${containerClasses[size]} rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center shrink-0 overflow-hidden theme-transition`}>
      <Image 
        src={`/images/face${faceNumber}.png`}
        alt={`Avatar for ${clientName}`}
        width={imageSizes[size].width}
        height={imageSizes[size].height}
        className={imageClasses[size] + " object-cover"}
      />
    </div>
  );
} 