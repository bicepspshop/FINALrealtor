import Image from "next/image"

interface ClientAvatarProps {
  clientId: string;
  clientName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ClientAvatar({ clientId, clientName = 'Client', size = 'md' }: ClientAvatarProps) {
  // Get a consistent number from 1 to 13 based on client ID
  const faceNumber = 1 + (parseInt(clientId.substring(0, 8), 16) % 13);
  
  // Define sizes based on the size prop
  const sizesMap = {
    sm: { container: "w-14 h-14", dimension: 56 },
    md: { container: "w-20 h-20", dimension: 80 },
    lg: { container: "w-40 h-40", dimension: 160 }
  };
  
  const { container, dimension } = sizesMap[size];
  
  return (
    <div className={`${container} rounded-full bg-gray-100 dark:bg-dark-slate flex items-center justify-center shrink-0 overflow-hidden theme-transition`}>
      <Image 
        src={`/images/face${faceNumber}.png`}
        alt={`Avatar for ${clientName}`}
        width={dimension}
        height={dimension}
        className="w-full h-full object-cover"
      />
    </div>
  );
} 