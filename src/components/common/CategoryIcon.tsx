import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  color?: string;
}

export function CategoryIcon({ name, className = 'w-4 h-4', color }: CategoryIconProps) {
  // Normalize icon name e.g. "GraduationCap", "utensils" -> PascalCase
  const formattedName = name
    .split(/[-_ ]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  // Lookup in Icons
  const IconComponent = (Icons as Record<string, any>)[formattedName] ||
    (Icons as Record<string, any>)[name] ||
    Icons.Tag;

  return <IconComponent className={className} style={color ? { color } : undefined} />;
}
