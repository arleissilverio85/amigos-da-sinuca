export interface Player {
  id: string;
  name: string;
  matches: number;
  wins: number;
  losses: number;
  points: number;
  balance: number;
  photo: string | null;
  isCurrentUser?: boolean;
}

export const generateMockPlayers = (currentUserData: any): Player[] => {
  const mocks: Player[] = [
    {
      id: 'current',
      name: currentUserData?.name || 'Seu Perfil',
      matches: currentUserData?.matches || 10,
      wins: currentUserData?.wins || 7,
      losses: currentUserData?.losses || 3,
      points: currentUserData?.points || 1500,
      balance: currentUserData?.balance || 50,
      photo: currentUserData?.photo || null,
      isCurrentUser: true,
    },
    { id: '1', name: 'Zeca do Taco', matches: 45, wins: 38, losses: 7, points: 2800, balance: 450, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zeca' },
    { id: '2', name: 'Bolinha de Gude', matches: 32, wins: 20, losses: 12, points: 1950, balance: 120, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bolinha' },
    { id: '3', name: 'Mestre do Giz', matches: 50, wins: 42, losses: 8, points: 3100, balance: 600, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Giz' },
    { id: '4', name: 'Rainha da Caçapa', matches: 28, wins: 25, losses: 3, points: 2400, balance: 380, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rainha' },
    { id: '5', name: 'Taco de Ouro', matches: 60, wins: 55, losses: 5, points: 4200, balance: 1200, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ouro' },
    { id: '6', name: 'Estrategista', matches: 22, wins: 15, losses: 7, points: 1200, balance: 90, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Estra' },
    { id: '7', name: 'Bola 8 Killer', matches: 35, wins: 18, losses: 17, points: 1450, balance: 45, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Killer' },
    { id: '8', name: 'Sinuca de Bico', matches: 15, wins: 12, losses: 3, points: 980, balance: 200, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bico' },
    { id: '9', name: 'Velho do Rio', matches: 80, wins: 40, losses: 40, points: 2100, balance: -50, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rio' },
    { id: '10', name: 'Canhota Bruta', matches: 12, wins: 10, losses: 2, points: 850, balance: 150, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Canhota' },
    { id: '11', name: 'Tabela Certa', matches: 40, wins: 22, losses: 18, points: 1700, balance: 85, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tabela' },
    { id: '12', name: 'Efeito 360', matches: 25, wins: 14, losses: 11, points: 1150, balance: 30, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Efeito' },
    { id: '13', name: 'Garra do Tigre', matches: 18, wins: 16, losses: 2, points: 1300, balance: 280, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tigre' },
    { id: '14', name: 'Lenda Urbana', matches: 100, wins: 95, losses: 5, points: 8500, balance: 5000, photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lenda' },
  ];

  return mocks.sort((a, b) => b.points - a.points);
};