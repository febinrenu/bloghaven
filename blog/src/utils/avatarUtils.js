// Generate avatar with initials and gradient background
export const generateAvatar = (name, email) => {
  if (!name && !email) {
    return 'https://ui-avatars.com/api/?name=User&background=667eea&color=fff&size=200&bold=true';
  }
  
  const displayName = name || email.split('@')[0];
  const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Generate consistent color from name
  const colors = [
    { bg: '667eea', text: 'fff' },
    { bg: 'f093fb', text: 'fff' },
    { bg: '4facfe', text: 'fff' },
    { bg: 'fa709a', text: 'fff' },
    { bg: '30cfd0', text: 'fff' },
    { bg: 'a8edea', text: '000' },
    { bg: 'fed6e3', text: '000' },
    { bg: 'ffecd2', text: '000' },
  ];
  
  const hash = displayName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorScheme = colors[hash % colors.length];
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${colorScheme.bg}&color=${colorScheme.text}&size=200&bold=true&font-size=0.4`;
};

// Get user's avatar URL
export const getUserAvatar = (user) => {
  if (!user) return generateAvatar('', '');
  if (user.avatar && !user.avatar.includes('dicebear')) return user.avatar;
  return generateAvatar(user.name, user.email);
};
